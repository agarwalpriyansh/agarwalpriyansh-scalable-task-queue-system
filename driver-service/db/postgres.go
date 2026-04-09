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
