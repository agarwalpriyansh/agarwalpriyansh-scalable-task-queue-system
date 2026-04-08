package worker

import (
	"net/http"
	"worker-service/config"
	"worker-service/models"
	"worker-service/services"
	"worker-service/utils"
)

func ProcessTask(task models.Task) {
	drivers := services.GetDrivers()

	for _, d := range drivers {
		if services.LockDriver(d.ID) {
			utils.InfoLogger.Println("Driver assigned:", d.ID)

			services.CreateRide(task, d.ID)
			MarkCompleted(task.ID)

			return
		}
	}

	utils.InfoLogger.Println("No driver found, retrying...")
	RetryTask(task)
}

func MarkCompleted(taskID string) {
	_, err := http.Post(config.TASK_SERVICE+"/task/complete?task_id="+taskID, "application/json", nil)
	if err != nil {
		utils.ErrorLogger.Println("Failed to mark completed:", err)
	}
}

func RetryTask(task models.Task) {
	if task.Retry >= 3 {
		_, err := http.Post(config.TASK_SERVICE+"/task/fail?task_id="+task.ID, "application/json", nil)
		if err != nil {
			utils.ErrorLogger.Println("Failed to mark failed:", err)
		}
		return
	}

	_, err := http.Post(config.TASK_SERVICE+"/task/retry?task_id="+task.ID, "application/json", nil)
	if err != nil {
		utils.ErrorLogger.Println("Retry failed:", err)
	}
}