require "test_helper"

class SensorThresholdsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @sensor_threshold = sensor_thresholds(:one)
  end

  test "should get index" do
    get sensor_thresholds_url, as: :json
    assert_response :success
  end

  test "should create sensor_threshold" do
    assert_difference("SensorThreshold.count") do
      post sensor_thresholds_url, params: { sensor_threshold: { sensor_id: @sensor_threshold.sensor_id, threshold_value: @sensor_threshold.threshold_value } }, as: :json
    end

    assert_response :created
  end

  test "should show sensor_threshold" do
    get sensor_threshold_url(@sensor_threshold), as: :json
    assert_response :success
  end

  test "should update sensor_threshold" do
    patch sensor_threshold_url(@sensor_threshold), params: { sensor_threshold: { sensor_id: @sensor_threshold.sensor_id, threshold_value: @sensor_threshold.threshold_value } }, as: :json
    assert_response :success
  end

  test "should destroy sensor_threshold" do
    assert_difference("SensorThreshold.count", -1) do
      delete sensor_threshold_url(@sensor_threshold), as: :json
    end

    assert_response :no_content
  end
end
