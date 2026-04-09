package models

type Task struct {
	ID              string `json:"task_id"`
	UserID          string `json:"user_id"`
	PickupLocation  string `json:"pickup_location"`
	DropoffLocation string `json:"dropoff_location"`
	Retry           int    `json:"retry"`
}

type Driver struct {
	ID        string  `json:"id"`
	Name      string  `json:"name"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
	Status    string  `json:"status"`
}