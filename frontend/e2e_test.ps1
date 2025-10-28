$ErrorActionPreference = 'Stop'
$base = 'http://localhost:3000'
Write-Output "Using base: $base"

$payload = @{
  title = 'E2E Test Book'
  author = @{ name = 'E2E Author' }
  category = @{ name = 'E2E Category' }
  year = 2025
  description = 'E2E test description'
}
$body = $payload | ConvertTo-Json -Depth 5
Write-Output "Creating book..."
$created = $null

# Create author and category first (API expects authorId and categoryId strings)
Write-Output "Creating author..."
$authorPayload = @{ name = 'E2E Author' } | ConvertTo-Json
$author = Invoke-RestMethod -Method Post -Uri "$base/authors" -Body $authorPayload -ContentType 'application/json'
Write-Output "Created author: $($author | ConvertTo-Json -Depth 5)"
$authorId = $author.id

Write-Output "Creating category..."
$categoryPayload = @{ name = 'E2E Category' } | ConvertTo-Json
$category = Invoke-RestMethod -Method Post -Uri "$base/categories" -Body $categoryPayload -ContentType 'application/json'
Write-Output "Created category: $($category | ConvertTo-Json -Depth 5)"
$categoryId = $category.id

# Now create the book using authorId and categoryId as strings
$bookPayload = @{
  title = 'E2E Test Book'
  description = 'E2E test description'
  authorId = [string]$authorId
  categoryId = [string]$categoryId
} | ConvertTo-Json -Depth 5
Write-Output "Creating book..."
$created = Invoke-RestMethod -Method Post -Uri "$base/books" -Body $bookPayload -ContentType 'application/json'
Write-Output "Created: $($created | ConvertTo-Json -Depth 5)"
$id = $created.id
if (-not $id) { Write-Output 'ERROR: created response missing id'; exit 2 }
Write-Output "Created id: $id"

Write-Output 'Listing books...'
$list = Invoke-RestMethod -Uri "$base/books"
if ($list -is [System.Array]) { Write-Output ("List count: " + $list.Length) } else { Write-Output 'List count: 1' }

Write-Output "Fetching book by id $id..."
$fetched = Invoke-RestMethod -Uri "$base/books/$id"
Write-Output "Fetched: $($fetched | ConvertTo-Json -Depth 5)"

Write-Output 'Updating book title and author...'
$update = @{
  title = 'E2E Test Book (edited)'
  description = 'Edited description'
  authorId = [string]$authorId
  categoryId = [string]$categoryId
}
$body2 = $update | ConvertTo-Json -Depth 5
$updated = Invoke-RestMethod -Method Patch -Uri "$base/books/$id" -Body $body2 -ContentType 'application/json'
Write-Output "Updated: $($updated | ConvertTo-Json -Depth 5)"

Write-Output 'Deleting book...'
Invoke-RestMethod -Method Delete -Uri "$base/books/$id"
Write-Output 'Deleted'

Write-Output 'Verifying deletion...'
try {
  Invoke-RestMethod -Uri "$base/books/$id"
  Write-Output 'ERROR: book still exists after delete'
} catch {
  Write-Output ("Confirmed deletion: " + $_.Exception.Message)
}
