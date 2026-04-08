package handlers

import (
	"context"
	"fmt"
	"net/http"

	"driver-service/db"

	"github.com/gin-gonic/gin"
)

type ReleaseRequest struct {
	DriverID string `json:"driver_id" binding:"required"`
	TaskID   string `json:"task_id" binding:"required"`
	Status   string `json:"status"` // "busy" or "available"
}

func ReleaseDriver(c *gin.Context) {
	var req ReleaseRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	lockKey := fmt.Sprintf("driver_lock:%s", req.DriverID)
	ctx := context.Background()

	// Verify the task releasing the lock actually owns it
	val, err := db.RDB.Get(ctx, lockKey).Result()
	if err != nil || val != req.TaskID {
		c.JSON(http.StatusForbidden, gin.H{
			"error": "Lock not held by this task or already expired",
		})
		return
	}

	// Delete the Redis lock
	db.RDB.Del(ctx, lockKey)

	// Set final driver status in Postgres
	newStatus := req.Status
	if newStatus == "" {
		newStatus = "available"
	}
	db.DB.Exec(
		context.Background(),
		`UPDATE drivers SET status = $1 WHERE id = $2`,
		newStatus, req.DriverID,
	)

	c.JSON(http.StatusOK, gin.H{
		"released":  true,
		"driver_id": req.DriverID,
		"status":    newStatus,
	})
}
