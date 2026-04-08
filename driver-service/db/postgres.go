package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func InitPostgres(connStr string) {
	var err error

	DB, err = pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatalf("Unable to create pool: %v", err)
	}

	err = DB.Ping(context.Background())
	if err != nil {
		log.Fatalf("Postgres ping failed: %v", err)
	}

	log.Println("✅ Postgres connected")
}
