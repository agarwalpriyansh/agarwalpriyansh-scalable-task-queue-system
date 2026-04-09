package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	PostgresURL    string
	RedisURL       string
	Port           string
	LockTTLSeconds int
}

var AppConfig Config

func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}

	ttl, err := strconv.Atoi(os.Getenv("LOCK_TTL_SECONDS"))
	if err != nil || ttl == 0 {
		ttl = 30
	}

	AppConfig = Config{
		PostgresURL:    getEnv("POSTGRES_URL", "postgres://postgres@127.0.0.1:5432/ride_booking?sslmode=disable"),
		RedisURL:       getEnv("REDIS_URL", "redis://localhost:6379"),
		Port:           getEnv("PORT", "8081"),
		LockTTLSeconds: ttl,
	}

	log.Printf("Config loaded — Port: %s, LockTTL: %ds", AppConfig.Port, AppConfig.LockTTLSeconds)
	log.Printf("POSTGRES_URL used: %s", AppConfig.PostgresURL)
}

func getEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}
