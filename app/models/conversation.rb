class Conversation < ApplicationRecord
  belongs_to :user
  has_many :messages, dependent: :destroy

  # validates :title, presence: true

  def add_user_message(content)
    messages.create!(content: content, role: "user")
  end

  def add_assistant_message(content)
    messages.create!(content: content, role: "assistant")
  end
end
