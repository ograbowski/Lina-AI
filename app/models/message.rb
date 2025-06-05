class Message < ApplicationRecord
  belongs_to :conversation

  validates  :content, presence: true
  validates :role, inclusion: { in: %w[user assistant system] }

  scope :chronological, -> { order(created_at: :asc) }

end
