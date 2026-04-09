package handlers

import (
	"context"
	"net/http"

	"driver-service/db"
	"driver-service/models"

	"github.com/gin-gonic/gin"
)

func CreateDriver(c *gin.Context) {
	var d models.Driver
	if err := c.ShouldBindJSON(&d); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if d.Status == "" {
		d.Status = "available"
	}

	query := `
		INSERT INTO drivers (id, name, latitude, longitude, status)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (id) DO UPDATE SET
			name = EXCLUDED.name,
			latitude = EXCLUDED.latitude,
			longitude = EXCLUDED.longitude,
			status = EXCLUDED.status
	`
	_, err := db.DB.Exec(context.Background(), query, d.ID, d.Name, d.Latitude, d.Longitude, d.Status)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, d)
}
