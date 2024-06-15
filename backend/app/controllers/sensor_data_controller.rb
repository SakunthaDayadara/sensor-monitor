class SensorDataController < ApplicationController
  before_action :set_sensor_datum, only: %i[ show update destroy ]

  # GET /sensor_data
  def index
    @sensor_data = SensorDatum.all

    render json: @sensor_data
  end

  # GET /sensor_data/1
  def show
    render json: @sensor_datum
  end

  # POST /sensor_data
  def create
    @sensor_datum = SensorDatum.new(sensor_datum_params)

    if @sensor_datum.save
      render json: @sensor_datum, status: :created, location: @sensor_datum
    else
      render json: @sensor_datum.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /sensor_data/1
  def update
    if @sensor_datum.update(sensor_datum_params)
      render json: @sensor_datum
    else
      render json: @sensor_datum.errors, status: :unprocessable_entity
    end
  end

  # DELETE /sensor_data/1
  def destroy
    @sensor_datum.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_sensor_datum
      @sensor_datum = SensorDatum.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def sensor_datum_params
      params.require(:sensor_datum).permit(:sensor_id, :date_column, :time_column, :data_value, :date_str)
    end
end
