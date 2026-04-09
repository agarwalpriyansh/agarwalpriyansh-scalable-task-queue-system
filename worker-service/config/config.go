package config

import "os"

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}

var (
	TASK_SERVICE   = getEnv("TASK_SERVICE_URL", "http://localhost:5000")
	DRIVER_SERVICE = getEnv("DRIVER_SERVICE_URL", "http://localhost:8081")
	RIDE_SERVICE   = getEnv("RIDE_SERVICE_URL", "http://localhost:4000")
)