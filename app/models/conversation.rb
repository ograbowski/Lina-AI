class Conversation < ApplicationRecord
  belongs_to :user
  has_many :messages, dependent: :destroy

  validates :title, presence: true
  validate :must_have_user_message, on: :update

  scope :with_messages, -> { joins(:messages).distinct }

  def add_user_message(content)
    messages.create!(content: content, role: "user")
  end

  def add_assistant_message(content)
    messages.create!(content: content, role: "assistant")
  end

  def has_user_messages?
    messages.where(role: "user").exists?
  end

  private

  def must_have_user_message
    unless has_user_messages?
      errors.add(:base, "Conversation must have at least one user message.")
    end
  end
end