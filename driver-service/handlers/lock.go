package handlers

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"driver-service/db"

	"github.com/gin-gonic/gin"
)

type LockRequest struct {
	DriverID string `json:"driver_id" binding:"required"`
	TaskID   string `json:"task_id" binding:"required"`
}

func LockDriver(c *gin.Context) {
	var req LockRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ttlSecs, _ := strconv.Atoi(os.Getenv("LOCK_TTL_SECONDS"))
	if ttlSecs == 0 {
		ttlSecs = 30
	}

	lockKey := fmt.Sprintf("driver_lock:%s", req.DriverID)
	lockValue := req.TaskID // store which task holds the lock
	ttl := time.Duration(ttlSecs) * time.Second

	ctx := context.Background()

	// SET NX = set ONLY if key does not exist — this is the atomic part
	success, err := db.RDB.SetNX(ctx, lockKey, lockValue, ttl).Result()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Redis error"})
		return
	}
	if !success {
		// Another worker already locked this driver
		c.JSON(http.StatusConflict, gin.H{
			"locked":  false,
			"message": "Driver already locked by another worker",
		})
		return
	}

	// Also update Postgres status for consistency
	_, err = db.DB.Exec(
		context.Background(),
		`UPDATE drivers SET status = 'locked' WHERE id = $1`,
		req.DriverID,
	)
	if err != nil {
		// Rollback the Redis lock if Postgres update fails
		db.RDB.Del(ctx, lockKey)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"locked":    true,
		"driver_id": req.DriverID,
		"task_id":   req.TaskID,
		"ttl_secs":  ttlSecs,
	})
}
