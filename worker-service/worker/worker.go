package worker

import (
	"net/http"
	"strconv"
	"strings"
	"time"
	"worker-service/config"
	"worker-service/models"
	"worker-service/services"
	"worker-service/utils"
)

func ProcessTask(task models.Task) {
	lat, lng := parseLocation(task.PickupLocation)
	drivers := services.GetDrivers(lat, lng)

	for _, d := range drivers {
		if services.LockDriver(d.ID, task.ID) {
			utils.InfoLogger.Println("Driver assigned:", d.ID)
			services.CreateRide(task, d.ID)

			// Simulating ride duration as requested (1 minute)
			utils.InfoLogger.Println("Ride in progress for task:", task.ID)
			time.Sleep(1 * time.Minute)

			// Free the driver after the ride
			services.ReleaseDriver(d.ID, task.ID)
			utils.InfoLogger.Println("Ride completed and driver released:", d.ID)

			MarkCompleted(task.ID)
			return
		}
	}

	utils.InfoLogger.Println("No driver found, retrying...")
	RetryTask(task)
}

func parseLocation(loc string) (float64, float64) {
	parts := strings.Split(loc, ",")
	if len(parts) == 2 {
		lat, latErr := strconv.ParseFloat(strings.TrimSpace(parts[0]), 64)
		lng, lngErr := strconv.ParseFloat(strings.TrimSpace(parts[1]), 64)
		if latErr == nil && lngErr == nil {
			return lat, lng
		}
	}
	return 12.9716, 77.5946
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