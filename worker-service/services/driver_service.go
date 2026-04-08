package services

import (
	"bytes"
	"encoding/json"
	"net/http"
	"worker-service/config"
	"worker-service/models"
	"worker-service/utils"
)

func GetDrivers() []models.Driver {
	resp, err := http.Get(config.DRIVER_SERVICE + "/drivers/nearby")
	if err != nil {
		utils.ErrorLogger.Println("Failed to fetch drivers:", err)
		return nil
	}
	defer resp.Body.Close()

	var drivers []models.Driver
	json.NewDecoder(resp.Body).Decode(&drivers)

	return drivers
}

func LockDriver(driverID string) bool {
	body, _ := json.Marshal(map[string]string{
		"driver_id": driverID,
	})

	resp, err := http.Post(config.DRIVER_SERVICE+"/drivers/lock", "application/json", bytes.NewBuffer(body))
	if err != nil {
		utils.ErrorLogger.Println("Driver lock failed:", err)
		return false
	}
	defer resp.Body.Close()

	return resp.StatusCode == 200
}