package main

import (
	"log"

	"driver-service/config"
	"driver-service/db"
	"driver-service/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	config.Load() // this loads .env AND sets AppConfig

	db.InitPostgres(config.AppConfig.PostgresURL)
	db.InitRedis(config.AppConfig.RedisURL)

	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	r.GET("/drivers/nearby", handlers.GetNearbyDrivers)
	r.POST("/drivers/lock", handlers.LockDriver)
	r.POST("/drivers/release", handlers.ReleaseDriver)

	log.Printf("Driver Service running on :%s", config.AppConfig.Port)
	r.Run(":" + config.AppConfig.Port)
}
