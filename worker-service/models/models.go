package models

type Task struct {
	ID     string `json:"task_id"`
	Pickup string `json:"pickup"`
	Drop   string `json:"drop"`
	Retry  int    `json:"retry"`
}

type Driver struct {
	ID string `json:"id"`
}