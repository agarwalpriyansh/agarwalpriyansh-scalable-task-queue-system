package handlers

import (
	"context"
	"net/http"
	"strconv"

	"driver-service/db"
	"driver-service/models"

	"github.com/gin-gonic/gin"
)

func GetNearbyDrivers(c *gin.Context) {
	lat, _ := strconv.ParseFloat(c.Query("lat"), 64)
	lng, _ := strconv.ParseFloat(c.Query("lng"), 64)
	radiusKm, _ := strconv.ParseFloat(c.DefaultQuery("radius_km", "5"), 64)

	// Haversine approximation using SQL
	query := `
        SELECT id, name, latitude, longitude, status
        FROM drivers
        WHERE status = 'available'
          AND (
            6371 * acos(
              cos(radians($1)) * cos(radians(latitude)) *
              cos(radians(longitude) - radians($2)) +
              sin(radians($1)) * sin(radians(latitude))
            )
          ) < $3
        LIMIT 10
    `
	rows, err := db.DB.Query(context.Background(), query, lat, lng, radiusKm)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer rows.Close()

	var drivers []models.Driver
	for rows.Next() {
		var d models.Driver
		rows.Scan(&d.ID, &d.Name, &d.Latitude, &d.Longitude, &d.Status)
		drivers = append(drivers, d)
	}
	c.JSON(http.StatusOK, gin.H{"drivers": drivers, "count": len(drivers)})
}
