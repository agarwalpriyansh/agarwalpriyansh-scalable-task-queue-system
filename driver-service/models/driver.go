package models

type Driver struct {
	ID        string  `json:"id" db:"id"`
	Name      string  `json:"name" db:"name"`
	Latitude  float64 `json:"latitude" db:"latitude"`
	Longitude float64 `json:"longitude" db:"longitude"`
	Status    string  `json:"status" db:"status"`
}
