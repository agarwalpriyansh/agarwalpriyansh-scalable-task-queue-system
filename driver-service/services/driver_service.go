package services

import (
	"context"
	"fmt"
	"time"

	"driver-service/db"
	"driver-service/models"
)

// GetNearbyAvailableDrivers fetches available drivers within radius
func GetNearbyAvailableDrivers(lat, lng, radiusKm float64) ([]models.Driver, error) {
	query := `
        SELECT id, name, latitude, longitude, status
        FROM drivers
        WHERE status = 'available'
          AND (
            6371 * acos(
              cos(radians($1)) * cos(radians(latitude)) *
              cos(radians(longitude) - radians($2)) +
              sin(radians($1)) * sin(radians(latitude))
            )
          ) < $3
        LIMIT 10
    `
	rows, err := db.DB.Query(context.Background(), query, lat, lng, radiusKm)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var drivers []models.Driver
	for rows.Next() {
		var d models.Driver
		rows.Scan(&d.ID, &d.Name, &d.Latitude, &d.Longitude, &d.Status)
		drivers = append(drivers, d)
	}
	return drivers, nil
}

// TryLockDriver attempts atomic lock on a driver via Redis SET NX
func TryLockDriver(driverID, taskID string, ttl time.Duration) (bool, error) {
	lockKey := fmt.Sprintf("driver_lock:%s", driverID)
	ctx := context.Background()

	success, err := db.RDB.SetNX(ctx, lockKey, taskID, ttl).Result()
	if err != nil {
		return false, err
	}
	if !success {
		return false, nil // already locked
	}

	// Update Postgres status
	_, err = db.DB.Exec(context.Background(), `UPDATE drivers SET status = 'locked' WHERE id = $1`, driverID)
	if err != nil {
		// Rollback Redis lock
		db.RDB.Del(ctx, lockKey)
		return false, err
	}

	return true, nil
}

// ReleaseDriver releases the lock and sets final driver status
func ReleaseDriver(driverID, taskID, finalStatus string) (bool, error) {
	lockKey := fmt.Sprintf("driver_lock:%s", driverID)
	ctx := context.Background()

	// Verify ownership before releasing
	val, err := db.RDB.Get(ctx, lockKey).Result()
	if err != nil || val != taskID {
		return false, fmt.Errorf("lock not owned by task %s", taskID)
	}

	db.RDB.Del(ctx, lockKey)

	if finalStatus == "" {
		finalStatus = "available"
	}
	db.DB.Exec(context.Background(), `UPDATE drivers SET status = $1 WHERE id = $2`, finalStatus, driverID)

	return true, nil
}

// GetDriverByID fetches a single driver record
func GetDriverByID(driverID string) (*models.Driver, error) {
	var d models.Driver
	err := db.DB.QueryRow(
		context.Background(),
		`SELECT id, name, latitude, longitude, status FROM drivers WHERE id = $1`,
		driverID,
	).Scan(&d.ID, &d.Name, &d.Latitude, &d.Longitude, &d.Status)
	if err != nil {
		return nil, err
	}
	return &d, nil
}

// IsDriverLocked checks if a driver currently has an active Redis lock
func IsDriverLocked(driverID string) (bool, error) {
	lockKey := fmt.Sprintf("driver_lock:%s", driverID)
	exists, err := db.RDB.Exists(context.Background(), lockKey).Result()
	return exists > 0, err
}
