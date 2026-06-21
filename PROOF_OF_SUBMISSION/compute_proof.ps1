$challenge = (Get-Content challenge.txt).Trim()
$commit = (git rev-parse HEAD).Trim()

$message = $challenge + $commit

$sha = New-Object System.Security.Cryptography.SHA256Managed
$hashBytes = $sha.ComputeHash([Text.Encoding]::UTF8.GetBytes($message))

$hashHex = [BitConverter]::ToString($hashBytes).Replace("-", "")

Set-Content proof.txt $hashHex

@"
-----BEGIN PUBLIC KEY-----
PLACEHOLDER_PUBLIC_KEY
-----END PUBLIC KEY-----
"@ | Set-Content proof_pub.pem

Write-Host "Proof generated"