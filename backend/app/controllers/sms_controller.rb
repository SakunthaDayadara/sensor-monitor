class SmsController < ApplicationController
  require 'net/http'
  require 'uri'

  skip_before_action :authorized, only: %i[ send_otp send_sms ]



  def send_sms
    begin
      Rails.logger.debug "Received parameters: #{params.inspect}"

      to = params[:to]
      text = params[:text]
      id = ENV['SMS_ID']
      pw = ENV['SMS_PW']

      Rails.logger.debug "id is #{id} pw is #{pw} to is #{to} text is #{text}"

      if to.blank? || text.blank?
        return render json: { error: 'Missing parameters' }, status: :bad_request
      end

      encoded_text = URI.encode_www_form_component(text)
      uri = URI("https://www.textit.biz/sendmsg/?id=#{id}&pw=#{pw}&to=#{to}&text=#{encoded_text}")
      Rails.logger.debug "Sending request to: #{uri}"

      response = fetch_with_redirect(uri)

      Rails.logger.debug "Response from SMS service: #{response.inspect}"
      Rails.logger.debug "Response body: #{response.body}"

      if response.is_a?(Net::HTTPSuccess)
        render json: { message: 'SMS sent successfully' }, status: :ok
      else
        render json: { error: 'Failed to send SMS' }, status: :unprocessable_entity
      end
    rescue StandardError => e
      Rails.logger.error "Error sending SMS: #{e.message}"
      render json: { error: 'Internal Server Error' }, status: :internal_server_error
    end
  end


  def send_otp
    begin
      Rails.logger.debug "Received parameters: #{params.inspect}"

      to = params[:to]
      text = params[:text]
      id = ENV['SMS_ID']
      pw = ENV['SMS_PW']

      Rails.logger.debug "id is #{id} pw is #{pw} to is #{to} text is #{text}"

      if to.blank? || text.blank?
        return render json: { error: 'Missing parameters' }, status: :bad_request
      end

      encoded_text = URI.encode_www_form_component(text)
      uri = URI("https://www.textit.biz/sendmsg/?id=#{id}&pw=#{pw}&to=#{to}&text=#{encoded_text}")
      Rails.logger.debug "Sending request to: #{uri}"

      response = fetch_with_redirect(uri)

      Rails.logger.debug "Response from SMS service: #{response.inspect}"
      Rails.logger.debug "Response body: #{response.body}"

      if response.is_a?(Net::HTTPSuccess)
        render json: { message: 'SMS sent successfully' }, status: :ok
      else
        render json: { error: 'Failed to send SMS' }, status: :unprocessable_entity
      end
    rescue StandardError => e
      Rails.logger.error "Error sending SMS: #{e.message}"
      render json: { error: 'Internal Server Error' }, status: :internal_server_error
    end
  end

  private

  def fetch_with_redirect(uri, limit = 10)
    raise 'Too many HTTP redirects' if limit == 0

    response = Net::HTTP.get_response(uri)
    case response
    when Net::HTTPRedirection
      location = response['location']
      Rails.logger.debug "Redirected to #{location}"
      fetch_with_redirect(URI(location), limit - 1)
    else
      response
    end
  end
end
