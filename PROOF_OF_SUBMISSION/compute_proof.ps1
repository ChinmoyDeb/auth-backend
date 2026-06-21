Write-Host "Generating cryptographic proof..."

cd ..

node generate-proof.js

cd PROOF_OF_SUBMISSION

Write-Host ""
Write-Host "Latest commit hash:"
git rev-parse HEAD

Write-Host ""
Write-Host "Generated files:"
Get-ChildItem proof.txt, proof_pub.pem

Write-Host ""
Write-Host "Proof generation complete."