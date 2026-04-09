package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PgxPoolIface interface {
	Exec(ctx context.Context, sql string, arguments ...any) (pgconn.CommandTag, error)
	Query(ctx context.Context, sql string, args ...any) (pgx.Rows, error)
	QueryRow(ctx context.Context, sql string, args ...any) pgx.Row
	Ping(ctx context.Context) error
}

var DB PgxPoolIface

func InitPostgres(connStr string) {
	var err error

	pool, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Unable to create pool: %v", err)
	}
	
	DB = pool

	err = DB.Ping(context.Background())
	if err != nil {
		log.Fatalf("Postgres ping failed: %v", err)
	}

	log.Println("✅ Postgres connected")
}

func RunMigrations() {
	query := `
        CREATE TABLE IF NOT EXISTS drivers (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255),
            latitude DOUBLE PRECISION NOT NULL,
            longitude DOUBLE PRECISION NOT NULL,
            status VARCHAR(50) DEFAULT 'available'
        );
    `
	_, err := DB.Exec(context.Background(), query)
	if err != nil {
		log.Fatalf("Migration failed: %v", err)
	}
	log.Println("✅ Database schema verified")
}

func SeedDrivers() {
	var count int
	err := DB.QueryRow(context.Background(), "SELECT COUNT(*) FROM drivers").Scan(&count)
	if err != nil {
		log.Printf("Seeding check failed: %v", err)
		return
	}

	if count > 0 {
		log.Println("⚡ Drivers already seeded")
		return
	}

	drivers := []struct {
		ID   string
		Name string
		Lat  float64
		Lng  float64
	}{
		{"driver-1", "Aman Sharma", 12.9716, 77.5946},
		{"driver-2", "Rahul Gupta", 12.9352, 77.6245},
		{"driver-3", "Sonia Nair", 12.9784, 77.6408},
		{"driver-4", "Vikram Singh", 13.0358, 77.5970},
		{"driver-5", "Priya Das", 12.9250, 77.5896},
	}

	for _, d := range drivers {
		_, err := DB.Exec(context.Background(),
			"INSERT INTO drivers (id, name, latitude, longitude, status) VALUES ($1, $2, $3, $4, 'available')",
			d.ID, d.Name, d.Lat, d.Lng)
		if err != nil {
			log.Printf("Failed to seed driver %s: %v", d.ID, err)
		}
	}
	log.Println("🌱 Seeded 5 dummy drivers")
}
