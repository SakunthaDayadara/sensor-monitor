require "test_helper"

class SensorDataControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sensor_datum = sensor_data(:one)
  end

  test "should get index" do
    get sensor_data_url, as: :json
    assert_response :success
  end

  test "should create sensor_datum" do
    assert_difference("SensorDatum.count") do
      post sensor_data_url, params: { sensor_datum: { data_value: @sensor_datum.data_value, date_column: @sensor_datum.date_column, sensor_id: @sensor_datum.sensor_id, time_column: @sensor_datum.time_column } }, as: :json
    end

    assert_response :created
  end

  test "should show sensor_datum" do
    get sensor_datum_url(@sensor_datum), as: :json
    assert_response :success
  end

  test "should update sensor_datum" do
    patch sensor_datum_url(@sensor_datum), params: { sensor_datum: { data_value: @sensor_datum.data_value, date_column: @sensor_datum.date_column, sensor_id: @sensor_datum.sensor_id, time_column: @sensor_datum.time_column } }, as: :json
    assert_response :success
  end

  test "should destroy sensor_datum" do
    assert_difference("SensorDatum.count", -1) do
      delete sensor_datum_url(@sensor_datum), as: :json
    end

    assert_response :no_content
  end
end
