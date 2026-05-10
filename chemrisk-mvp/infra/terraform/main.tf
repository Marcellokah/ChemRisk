# ChemRisk Infrastructure Definition
# Jelenleg: Placeholder erőforrás a pipeline teszteléséhez (ADR 0003)
# Később: Vercel Project, PostgreSQL config itt fog szerepelni.

resource "random_pet" "chemrisk_preview_id" {
  length    = 2
  separator = "-"
  prefix    = "chemrisk-pr"
}

output "preview_slug" {
  value       = random_pet.chemrisk_preview_id.id
  description = "A generált preview környezet azonosítója"
}