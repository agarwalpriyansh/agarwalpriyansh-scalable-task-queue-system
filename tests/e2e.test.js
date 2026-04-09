/**
 * End-to-End Test for Ride Booking Flow
 * 
 * This test verifies:
 * 1. Service Health (with Wait-for-Ready loop)
 * 2. Driver Seeding
 * 3. Ride Request (API Gateway)
 * 4. Task Processing (Task Service -> Worker Service)
 * 5. Driver Allocation (Driver Service)
 * 6. Ride Completion (Ride Service)
 */

const BASE_URLS = {
    API_GATEWAY: 'http://localhost:3000',
    DRIVER_SERVICE: 'http://localhost:8081',
    TASK_SERVICE: 'http://localhost:5000',
    RIDE_SERVICE: 'http://localhost:4000',
};

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function checkHealth(serviceName, url) {
    try {
        const res = await fetch(`${url}/health`, { signal: AbortSignal.timeout(2000) });
        return res.ok;
    } catch (e) {
        return false;
    }
}

async function waitForServices() {
    console.log('🔍 Waiting for services to be healthy...');
    const services = Object.keys(BASE_URLS);
    const maxAttempts = 30; // Increased to 90s total wait
    const delay = 3000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        let allHealthy = true;
        let statusReport = [];

        for (const s of services) {
            const isHealthy = await checkHealth(s, BASE_URLS[s]);
            if (!isHealthy) allHealthy = false;
            statusReport.push(`${s}: ${isHealthy ? '✅' : '❌'}`);
        }

        console.log(`   [Attempt ${attempt}/${maxAttempts}] ${statusReport.join(' | ')}`);

        if (allHealthy) {
            console.log('🚀 All services are healthy!');
            return true;
        }

        if (attempt < maxAttempts) await sleep(delay);
    }

    throw new Error('Timeout: Services did not become healthy in time.');
}

async function runTest() {
    console.log('🧪 Starting End-to-End Test Suite...');

    // 1. Wait for services to be ready
    await waitForServices();

    // 2. Seed a driver
    console.log('🚗 Seeding an available driver...');
    const driverId = 'test-driver-' + Date.now();
    const driverRes = await fetch(`${BASE_URLS.DRIVER_SERVICE}/drivers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: driverId,
            name: 'Test Driver',
            latitude: 12.9716,
            longitude: 77.5946,
            status: 'available'
        })
    });
    if (!driverRes.ok) throw new Error(`Failed to seed driver: ${driverRes.statusText}`);
    console.log(`✅ Driver seeded: ${driverId}`);

    // 3. Request a ride
    console.log('📱 Requesting a ride...');
    const rideRequestRes = await fetch(`${BASE_URLS.API_GATEWAY}/api/request-ride`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            user_id: 'test-user-123',
            pickup_location: 'Indiranagar, Bangalore',
            dropoff_location: 'Koramangala, Bangalore'
        })
    });
    if (!rideRequestRes.ok) throw new Error(`Failed to request ride: ${rideRequestRes.statusText}`);
    const { task_id } = await rideRequestRes.json();
    console.log(`✅ Ride requested. Task ID: ${task_id}`);

    // 4. Poll for status
    console.log('⏳ Polling for ride completion (max 30s)...');
    let status = 'PENDING';
    let attempts = 0;
    const maxAttempts = 15;

    while (status !== 'COMPLETED' && attempts < maxAttempts) {
        attempts++;
        await sleep(2000);
        
        try {
            const statusRes = await fetch(`${BASE_URLS.API_GATEWAY}/api/status/${task_id}`);
            if (statusRes.ok) {
                const data = await statusRes.json();
                // Check if ride record exists in ride-service via gateway
                if (data.driver_id && data.status === 'COMPLETED') {
                    console.log(`   ✨ Ride Completed! Assigned Driver: ${data.driver_id}`);
                    status = 'COMPLETED';
                    break;
                }
                status = data.status || 'PROCESSING';
                console.log(`   [Attempt ${attempts}] Status: ${status}`);
            } else {
                console.log(`   [Attempt ${attempts}] Task still in queue...`);
            }
        } catch (e) {
            console.log(`   [Attempt ${attempts}] Waiting for task indexing...`);
        }
    }

    if (status === 'COMPLETED') {
        console.log('🎉 E2E FLOW SUCCESSFUL!');
    } else {
        console.error('❌ E2E FLOW TIMEOUT: Task did not reach COMPLETED status');
        process.exit(1);
    }
}

runTest().catch(err => {
    console.error('💥 Test Failed:', err.message);
    process.exit(1);
});
