$EXPECTED_DIRS = (
  'components',
  'components/blocks',
  'components/segments',
  'components/editor',
  'components/common',
  'components/preview',
  'components/layout',
  'hooks',
  'contexts',
  'types',
  'types/schema',
  'schemas',
  'utils',
  'factories',
  'defaults',
  'generated',
  'fonts',
  'img',
  'services'
)

foreach ($dir in $EXPECTED_DIRS) {
  if (-not (Test-Path $dir)) {
    Write-Host "Creating directory $dir"
    New-Item -ItemType Directory -Path $dir
  }
}