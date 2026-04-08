package main

import (
	"time"
	"worker-service/services"
	"worker-service/utils"
	"worker-service/worker"
)

func main() {
	utils.InitLogger()

	utils.InfoLogger.Println("Worker Service Started")

	for {
		task := services.GetTask()

		if task.ID != "" {
			utils.InfoLogger.Println("Processing Task:", task.ID)
			worker.ProcessTask(task)
		}

		time.Sleep(2 * time.Second)
	}
}