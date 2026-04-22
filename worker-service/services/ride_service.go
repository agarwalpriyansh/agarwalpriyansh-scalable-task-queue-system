package services

import (
	"bytes"
	"encoding/json"
	"net/http"
	"worker-service/config"
	"worker-service/models"
	"worker-service/utils"
)

func CreateRide(task models.Task, driverID string, driverName string) {
	body, _ := json.Marshal(map[string]string{
		"task_id":          task.ID,
		"user_id":          task.UserID,
		"driver_id":        driverID,
		"driver_name":      driverName,
		"pickup_location":  task.PickupLocation,
		"dropoff_location": task.DropoffLocation,
	})

	_, err := http.Post(config.RIDE_SERVICE+"/ride/create", "application/json", bytes.NewBuffer(body))
	if err != nil {
		utils.ErrorLogger.Println("Failed to create ride:", err)
		return
	}

	utils.InfoLogger.Println("Ride created for task:", task.ID)
}