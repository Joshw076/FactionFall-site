param([switch]$ForPublication)
$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$config = Get-Content -LiteralPath (Join-Path $root 'site.config.json') -Raw | ConvertFrom-Json
$policy = Get-Content -LiteralPath (Join-Path $root 'privacy-policy.md') -Raw
$replacements = @{
    '[Game Name]' = $config.game
    '[Developer or Company Name]' = $config.developer
    '[Privacy Contact Email]' = $config.email
    '[Developer Website]' = $config.website
    '[Business Mailing Address]' = $config.mailingAddress
    '[Account Deletion URL]' = '/delete-account'
}
foreach ($key in $replacements.Keys) { $policy = $policy.Replace($key, $replacements[$key]) }
if ($ForPublication -and -not $config.readyToPublish) { throw 'Confirm the release practices in RELEASE-CHECKLIST.md and set readyToPublish to true before publication.' }
if ($config.readyToPublish) {
    if ($policy -match '\[[^\]]+\]') { throw 'Resolve all policy placeholders before publication.' }
    if ($config.email -notmatch '^[^\s@]+@[^\s@]+\.[^\s@]+$') { throw 'Set a valid public contact email.' }
    if ($config.website -notmatch '^https://') { throw 'Set the HTTPS website URL.' }
}
function Encode([string]$value) { [System.Net.WebUtility]::HtmlEncode($value) }
function Inline([string]$value) {
    $result = (Encode $value) -replace '\*\*(.+?)\*\*', '<strong>$1</strong>'
    $result = $result.Replace('/delete-account', '<a href="/delete-account">Account deletion page</a>')
    $result
}
function Markdown([string]$value) {
    $html = [System.Collections.Generic.List[string]]::new()
    $paragraph = [System.Collections.Generic.List[string]]::new()
    $inList = $false
    foreach ($line in (($value + "`n") -split '\r?\n')) {
        if ($line -match '^#' -or $line -match '^- ' -or [string]::IsNullOrWhiteSpace($line)) {
            if ($paragraph.Count) { $html.Add('<p>' + (($paragraph | ForEach-Object { Inline $_ }) -join '<br>') + '</p>'); $paragraph.Clear() }
        }
        if ($inList -and $line -notmatch '^- ') { $html.Add('</ul>'); $inList = $false }
        if ($line -match '^(#{1,3}) (.+)$') {
            $level = $Matches[1].Length; $title = $Matches[2]
            $html.Add("<h$level>$(Inline $title)</h$level>")
        } elseif ($line -match '^- (.+)$') {
            if (-not $inList) { $html.Add('<ul>'); $inList = $true }
            $html.Add('<li>' + (Inline $Matches[1]) + '</li>')
        } elseif (-not [string]::IsNullOrWhiteSpace($line)) { $paragraph.Add($line.Trim()) }
    }
    $html -join "`n"
}
$output = Join-Path $root 'dist'
New-Item -ItemType Directory -Force -Path $output | Out-Null
$banner = ''; $robots = ''
if (-not $config.readyToPublish) {
    $banner = '<aside class="draft" role="note"><strong>Draft   pending confirmation.</strong> These pages are being prepared. Contact details and game practices must be confirmed before release.</aside>'
    $robots = '<meta name="robots" content="noindex,nofollow">'
}
$email = Encode $config.email
$contact = '<p>Contact: <strong>' + $email + '</strong></p>'
if ($config.email -match '^[^\s@]+@[^\s@]+\.[^\s@]+$') { $contact = '<p><a class="button" href="mailto:' + $email + '">Email support</a></p>' }
$deletionContact = $contact
if ($config.email -match '^[^\s@]+@[^\s@]+\.[^\s@]+$') { $deletionContact = '<p><a class="button" href="mailto:' + $email + '?subject=FactionFall%20account%20deletion">Request account deletion by email</a></p>' }
$pages = @{
    '' = @{title='Player support & privacy'; body='<p class="eyebrow">FACTIONFALL</p><h1>Player support &amp; privacy</h1><p>Find information about player privacy, get help with the game, or request account and data deletion.</p><div class="cards"><a href="/privacy"><h2>Privacy policy</h2><p>How player information is handled.</p></a><a href="/support"><h2>Get support</h2><p>Help with your FactionFall experience.</p></a><a href="/delete-account"><h2>Account &amp; data deletion</h2><p>Request deletion of your information.</p></a></div>'}
    'privacy' = @{title='Privacy policy'; body=(Markdown $policy)}
    'support' = @{title='Support'; body='<h1>FactionFall support</h1><p>For gameplay, account, or privacy questions, contact our support team.</p>' + $contact + '<h2>What to include</h2><p>Describe the issue and include your game version, device model, and player ID if available. Never send passwords, sign-in codes, payment card details, or unnecessary personal information.</p><p>For account and personal data requests, visit <a href="/delete-account">account and data deletion</a>.</p>'}
    'delete-account' = @{title='Account & data deletion'; body='<h1>Delete your FactionFall account and data</h1><p>Players, or parents and guardians acting for a child, may request account and associated personal data deletion.</p><h2>How to request deletion</h2><ol><li>Email the contact below with the subject  FactionFall account deletion .</li><li>Include your player ID or nickname and the sign-in provider you use, if known. Do not send your password or sign-in codes.</li><li>We may ask for information needed to verify account ownership or parental authority before processing the request.</li></ol>' + $deletionContact + '<h2>Information covered by the request</h2><p>The deletion procedure, information covered, retention exceptions, and completion timeframe are awaiting confirmation.</p><p>Any legally required or permitted retention exceptions will be explained when processing the request. See our <a href="/privacy">privacy policy</a> for retention information.</p>'}
}
foreach ($route in $pages.Keys) {
    $page = $pages[$route]; $directory = if ($route) { Join-Path $output $route } else { $output }
    New-Item -ItemType Directory -Force -Path $directory | Out-Null
    $document = @"
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">$robots<title>$(Encode $page.title) | $(Encode $config.game)</title><meta name="description" content="FactionFall privacy, player support, and account deletion information."><link rel="stylesheet" href="/styles.css"></head>
<body><a class="skip" href="#main">Skip to content</a><header><a class="brand" href="/">FACTIONFALL<span>PLAYER INFORMATION</span></a><nav aria-label="Main navigation"><a href="/privacy">Privacy</a><a href="/support">Support</a><a href="/delete-account">Delete account</a></nav></header><main id="main">$banner$($page.body)</main><footer>$(Encode $config.game)   $(Encode $config.developer)<br><a href="/privacy">Privacy policy</a>   <a href="/support">Support</a>   <a href="/delete-account">Account deletion</a></footer></body></html>
"@
    [System.IO.File]::WriteAllText((Join-Path $directory 'index.html'), $document, [System.Text.UTF8Encoding]::new($false))
}
Copy-Item -LiteralPath (Join-Path $root 'styles.css') -Destination $output
$notFound = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | FactionFall</title><link rel="stylesheet" href="/styles.css"><main><h1>Page not found</h1><p><a href="/">Return to FactionFall support and privacy.</a></p></main></html>'
[System.IO.File]::WriteAllText((Join-Path $output '404.html'), $notFound)
$headers = "/*`n  X-Content-Type-Options: nosniff`n  Referrer-Policy: strict-origin-when-cross-origin`n  X-Frame-Options: DENY`n  Content-Security-Policy: default-src 'none'; style-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`n"
if (-not $config.readyToPublish) { $headers += "  X-Robots-Tag: noindex, nofollow`n" }
[System.IO.File]::WriteAllText((Join-Path $output '_headers'), $headers)
Compress-Archive -Path (Join-Path $output '*') -DestinationPath (Join-Path $root 'factionfall-pages.zip') -Force
Write-Output 'Built dist/ and factionfall-pages.zip.'
