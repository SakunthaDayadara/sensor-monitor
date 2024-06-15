require "test_helper"

class SensorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sensor = sensors(:one)
  end

  test "should get index" do
    get sensors_url, as: :json
    assert_response :success
  end

  test "should create sensor" do
    assert_difference("Sensor.count") do
      post sensors_url, params: { sensor: { sensor_id: @sensor.sensor_id, user_id: @sensor.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show sensor" do
    get sensor_url(@sensor), as: :json
    assert_response :success
  end

  test "should update sensor" do
    patch sensor_url(@sensor), params: { sensor: { sensor_id: @sensor.sensor_id, user_id: @sensor.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy sensor" do
    assert_difference("Sensor.count", -1) do
      delete sensor_url(@sensor), as: :json
    end

    assert_response :no_content
  end
end
