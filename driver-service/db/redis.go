package db

import (
	"context"
	"log"

	"github.com/redis/go-redis/v9"
)

var RDB *redis.Client

func InitRedis(addr string) {
	opt, err := redis.ParseURL(addr)
	if err != nil {
		log.Fatalf("Redis URL parse failed: %v", err)
	}
	RDB = redis.NewClient(opt)
	if err = RDB.Ping(context.Background()).Err(); err != nil {
		log.Fatalf("Redis ping failed: %v", err)
	}
	log.Println("Redis connected")
}
