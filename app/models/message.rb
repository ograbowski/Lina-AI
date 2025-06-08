class Message < ApplicationRecord
  belongs_to :conversation

  validates :content, presence: true, length: { minimum: 1, maximum: 1000 }
  validates :role, inclusion: { in: %w[user assistant] }

  scope :chronological, -> { order(:created_at) }
  scope :by_user, -> { where(role: "user") }
  scope :by_assistant, -> { where(role: "assistant") }

  after_create_commit -> { broadcast_append_later_to conversation }
end