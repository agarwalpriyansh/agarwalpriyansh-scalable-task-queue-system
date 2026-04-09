package handlers

import (
	"bytes"
	"driver-service/db"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redismock/v9"
	"github.com/pashagolub/pgxmock/v4"
	"github.com/stretchr/testify/assert"
)

func TestLockDriver(t *testing.T) {
	gin.SetMode(gin.TestMode)

	redisClient, redisMock := redismock.NewClientMock()
	db.RDB = redisClient

	mockPg, err := pgxmock.NewPool()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer mockPg.Close()
	db.DB = mockPg

	t.Run("Success Lock", func(t *testing.T) {
		redisMock.ExpectSetNX("driver_lock:driver-123", "task-xyz", 30*time.Second).SetVal(true)
		mockPg.ExpectExec("UPDATE drivers SET status = 'locked'").
			WithArgs("driver-123").
			WillReturnResult(pgxmock.NewResult("UPDATE", 1))

		router := gin.Default()
		router.POST("/lock", LockDriver)

		reqBody := `{"driver_id":"driver-123","task_id":"task-xyz"}`
		req, _ := http.NewRequest(http.MethodPost, "/lock", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusOK, w.Code)
		if err := redisMock.ExpectationsWereMet(); err != nil {
			t.Errorf("there were unfulfilled expectations: %s", err)
		}
		if err := mockPg.ExpectationsWereMet(); err != nil {
			t.Errorf("there were unfulfilled expectations: %s", err)
		}
	})

	t.Run("Already Locked", func(t *testing.T) {
		redisMock.ExpectSetNX("driver_lock:driver-456", "task-abc", 30*time.Second).SetVal(false)

		router := gin.Default()
		router.POST("/lock", LockDriver)

		reqBody := `{"driver_id":"driver-456","task_id":"task-abc"}`
		req, _ := http.NewRequest(http.MethodPost, "/lock", bytes.NewBuffer([]byte(reqBody)))
		req.Header.Set("Content-Type", "application/json")
		
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, http.StatusConflict, w.Code)
	})
}
