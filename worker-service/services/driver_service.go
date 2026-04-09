package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"worker-service/config"
	"worker-service/models"
	"worker-service/utils"
)

func GetDrivers(lat, lng float64) []models.Driver {
	url := fmt.Sprintf("%s/drivers/nearby?lat=%f&lng=%f&radius_km=100",
		config.DRIVER_SERVICE, lat, lng)
	resp, err := http.Get(url)
	if err != nil {
		utils.ErrorLogger.Println("Failed to fetch drivers:", err)
		return nil
	}
	defer resp.Body.Close()

	var result struct {
		Drivers []models.Driver `json:"drivers"`
	}
	json.NewDecoder(resp.Body).Decode(&result)
	return result.Drivers
}

func LockDriver(driverID string, taskID string) bool {
	body, _ := json.Marshal(map[string]string{
		"driver_id": driverID,
		"task_id":   taskID,
	})

	resp, err := http.Post(config.DRIVER_SERVICE+"/drivers/lock", "application/json", bytes.NewBuffer(body))
	if err != nil {
		utils.ErrorLogger.Println("Driver lock failed:", err)
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode == 200
}