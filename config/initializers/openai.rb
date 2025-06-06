require "openai"

# Używamy ruby-openai gem z custom base URL dla Groq
OpenAI.configure do |config|
  config.access_token = ENV["GROQ_API_KEY"]
  config.uri_base = "https://api.groq.com/openai"
  config.log_errors = Rails.env.development?
end
