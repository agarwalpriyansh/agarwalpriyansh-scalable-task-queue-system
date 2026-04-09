package models

type TaskPayload struct {
	TaskID          string `json:"task_id"`
	UserID          string `json:"user_id"`
	PickupLocation  string `json:"pickup_location"`
	DropoffLocation string `json:"dropoff_location"`
	Status          string `json:"status"`
	Timestamp       string `json:"timestamp"`
}
