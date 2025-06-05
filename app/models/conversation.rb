class Conversation < ApplicationRecord
  has_many :messages, dependent: :destroy

  # validates :title, presence: true

  def add_user_message(content)
    message.create!(content: content, role: "user")
  end

  def add_assitant_message(content)
    message.create!(content: content, role: "assistant")
  end
end
