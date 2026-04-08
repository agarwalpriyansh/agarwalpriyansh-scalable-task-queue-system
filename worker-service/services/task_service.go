package services

import (
	"encoding/json"
	"net/http"
	"worker-service/config"
	"worker-service/models"
	"worker-service/utils"
)

func GetTask() models.Task {
	resp, err := http.Get(config.TASK_SERVICE + "/task/get")
	if err != nil {
		utils.ErrorLogger.Println("Failed to fetch task:", err)
		return models.Task{}
	}
	defer resp.Body.Close()

	var task models.Task
	json.NewDecoder(resp.Body).Decode(&task)

	return task
}