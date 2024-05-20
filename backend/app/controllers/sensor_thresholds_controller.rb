class SensorThresholdsController < ApplicationController
  before_action :set_sensor_threshold, only: %i[ show update destroy ]

  # GET /sensor_thresholds
  def index
    @sensor_thresholds = SensorThreshold.all

    render json: @sensor_thresholds
  end

  # GET /sensor_thresholds/1
  def show
    render json: @sensor_threshold
  end

  # POST /sensor_thresholds
  def create
    @sensor_threshold = SensorThreshold.new(sensor_threshold_params)

    if @sensor_threshold.save
      render json: @sensor_threshold, status: :created, location: @sensor_threshold
    else
      render json: @sensor_threshold.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sensor_thresholds/1
  def update
    if @sensor_threshold.update(sensor_threshold_params)
      render json: @sensor_threshold
    else
      render json: @sensor_threshold.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sensor_thresholds/1
  def destroy
    @sensor_threshold.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sensor_threshold
      @sensor_threshold = SensorThreshold.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def sensor_threshold_params
      params.require(:sensor_threshold).permit(:sensor_id, :threshold_value)
    end
end
