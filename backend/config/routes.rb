Rails.application.routes.draw do
  resources :sensor_thresholds
  resources :sensor_data
  resources :sensors
  resources :users do
    collection do
      post 'login'
      get 'auto_login'
    end

  end

  post 'send_sms', to: 'sms#send_sms'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"
end
