# Start the sshd service
Start-Service sshd

# OPTIONAL but recommended:
Set-Service -Name sshd -StartupType 'Automatic'

# Confirm the Firewall rule is configured. It should be created automatically by setup. Run the following to verify
if (!(Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue | Select-Object Name, Enabled)) {
    Write-Output "Firewall Rule 'OpenSSH-Server-In-TCP' does not exist, creating it..."
    New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
} else {
    Write-Output "Firewall rule 'OpenSSH-Server-In-TCP' has been created and exists."
}

# This script installs IIS and the features required to
# run West Wind Web Connection.
#
# * Make sure you run this script from a Powershel Admin Prompt!
# * Make sure Powershell Execution Policy is bypassed to run these scripts:
# * YOU MAY HAVE TO RUN THIS COMMAND PRIOR TO RUNNING THIS SCRIPT!
Set-ExecutionPolicy Bypass -Scope Process -Force

$testchoco = powershell choco -v
If(!($testchoco)) {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-Expression((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
}
				
#Set-ExecutionPolicy RemoteSigned

# To list all Windows Features: dism /online /Get-Features
# Get-WindowsOptionalFeature -Online 
# LIST All IIS FEATURES: 
# Get-WindowsOptionalFeature -Online | where FeatureName -like 'IIS-*'

choco install IIS-WebServerRole					--source WindowsFeatures	-y	-force
choco install IIS-WebServer                     --source WindowsFeatures    -y  -force
choco install IIS-CommonHttpFeatures            --source WindowsFeatures    -y  -force
choco install IIS-HttpErrors                    --source WindowsFeatures    -y  -force
choco install IIS-HttpRedirect                  --source WindowsFeatures    -y  -force
choco install IIS-ApplicationDevelopment        --source WindowsFeatures    -y  -force
                                                                                
choco install NetFx4Extended-ASPNET45           --source WindowsFeatures    -y  -force
choco install IIS-NetFxExtensibility45          --source WindowsFeatures    -y  -force
                                                                               
choco install IIS-HealthAndDiagnostics          --source WindowsFeatures    -y  -force
choco install IIS-HttpLogging                   --source WindowsFeatures    -y  -force
choco install IIS-LoggingLibraries              --source WindowsFeatures    -y  -force
choco install IIS-RequestMonitor                --source WindowsFeatures    -y  -force
choco install IIS-HttpTracing                   --source WindowsFeatures    -y  -force
choco install IIS-Security                      --source WindowsFeatures    -y  -force
choco install IIS-RequestFiltering              --source WindowsFeatures    -y  -force
choco install IIS-Performance                   --source WindowsFeatures    -y  -force
choco install IIS-WebServerManagementTools      --source WindowsFeatures    -y  -force
choco install IIS-IIS6ManagementCompatibility   --source WindowsFeatures    -y  -force
choco install IIS-Metabase                      --source WindowsFeatures    -y  -force
choco install IIS-ManagementConsole             --source WindowsFeatures    -y  -force
choco install IIS-BasicAuthentication           --source WindowsFeatures    -y  -force
choco install IIS-WindowsAuthentication         --source WindowsFeatures    -y  -force
choco install IIS-StaticContent                 --source WindowsFeatures    -y  -force
choco install IIS-DefaultDocument               --source WindowsFeatures    -y  -force
choco install IIS-WebSockets                    --source WindowsFeatures    -y  -force
choco install IIS-ApplicationInit               --source WindowsFeatures    -y  -force
choco install IIS-ISAPIExtensions               --source WindowsFeatures    -y  -force
choco install IIS-ISAPIFilter                   --source WindowsFeatures    -y  -force
choco install IIS-HttpCompressionStatic         --source WindowsFeatures    -y  -force

choco install IIS-NetFxExtensibility         --source WindowsFeatures    -y  -force
choco install IIS-ASPNET                      --source WindowsFeatures    -y  -force

choco install IIS-NetFxExtensibility45          --source WindowsFeatures    -y  -force
choco install IIS-ASPNET45                      --source WindowsFeatures    -y  -force

if ((gwmi win32_operatingsystem | select osarchitecture).osarchitecture -eq "64-bit")
{
	$fileExe64 = [IO.Path]::Combine($Env:WinDir, 'Microsoft.NET', 'Framework64', 'v4.0.30319', 'aspnet_regiis')
	$args64 = "-i"
	& $fileExe64 $args64
}
else
{
	$fileExe32 = [IO.Path]::Combine($Env:WinDir, 'Microsoft.NET', 'Framework', 'v4.0.21006', 'aspnet_regiis')
	$args32 = "-i"
	& $fileExe32 $args32
}

# If you need classic ASP (not recommended)
#Enable-WindowsOptionalFeature -Online -FeatureName IIS-ASP


# The following optional components require 
# Chocolatey OR Web Platform Installer to install


# Install UrlRewrite Module for Extensionless Urls (optional)
###  & "C:\Program Files\Microsoft\Web Platform Installer\WebpiCmd-x64.exe" /install /Products:UrlRewrite2 /AcceptEULA /SuppressPostFinish
#choco install urlrewrite -y
    
# Install WebDeploy for Deploying to IIS (optional)
### & "C:\Program Files\Microsoft\Web Platform Installer\WebpiCmd-x64.exe" /install /Products:WDeployNoSMO /AcceptEULA /SuppressPostFinish
# choco install webdeploy -y

# Disable Loopback Check on a Server - to get around no local Logins on Windows Server
# New-ItemProperty HKLM:\System\CurrentControlSet\Control\Lsa -Name "DisableLoopbackCheck" -Value "1" -PropertyType dword


# --------------------------HOSTING-----------------------------

#for dotnet core download and install dotnet hosting bundle
$temp_path = "C:\temp\"

if( ![System.IO.Directory]::Exists( $temp_path ) )
{
   Write-Output "Path not found ($temp_path)"
   New-Item -Path 'C:\temp\' -ItemType Directory
}

if( [System.IO.Directory]::Exists( $temp_path ) )
{
	#
	# Download the Windows Hosting Bundle Installer for ASP.NET Core 3.1 Runtime (v3.1.0)
	#
	# The installer URL was obtained from:
	# https://dotnet.microsoft.com/download/dotnet-core/thank-you/runtime-aspnetcore-3.1.0-windows-hosting-bundle-installer
	#

	$whb_installer_url = "https://download.visualstudio.microsoft.com/download/pr/fa3f472e-f47f-4ef5-8242-d3438dd59b42/9b2d9d4eecb33fe98060fd2a2cb01dcd/dotnet-hosting-3.1.0-win.exe"

	$whb_installer_file = $temp_path + [System.IO.Path]::GetFileName( $whb_installer_url )

	Try
	{

	   Invoke-WebRequest -Uri $whb_installer_url -OutFile $whb_installer_file

	   $setupfilelocation = $whb_installer_file #edit
       $args = New-Object -TypeName System.Collections.Generic.List[System.String]
       $args.Add("/quiet")
       $args.Add("/install")
       $args.Add("/norestart")
       $Output = Start-Process -FilePath $setupfilelocation -ArgumentList $args -NoNewWindow -Wait -PassThru
       If($Output.Exitcode -Eq 0)
       {
           net stop was /y
           net start w3svc
       }
       else {
           Write-HError "`t`t Something went wrong with the installation. Errorlevel: ${Output.ExitCode}"
           Exit 1
       }

	}
	Catch
	{
	   Write-Output ( $_.Exception.ToString() )
	   Break
	}

	#
	# Download Web Deploy v3.6
	#
	# The installer URL was obtained from:
	# https://www.iis.net/downloads/microsoft/web-deploy
	# x86 installer: https://download.microsoft.com/download/0/1/D/01DC28EA-638C-4A22-A57B-4CEF97755C6C/WebDeploy_x86_en-US.msi
	# x64 installer: https://download.microsoft.com/download/0/1/D/01DC28EA-638C-4A22-A57B-4CEF97755C6C/WebDeploy_amd64_en-US.msi
	#
	#
	#$wd_installer_url = "https://download.microsoft.com/download/0/1/D/01DC28EA-638C-4A22-A57B-4CEF97755C6C/WebDeploy_amd64_en-US.msi"
	#
	#$wd_installer_file = $temp_path + [System.IO.Path]::GetFileName( $wd_installer_url )
	#
	#Try
	#{
	#
	#   Invoke-WebRequest -Uri $wd_installer_url -OutFile $wd_installer_file
	#
	#   Write-Output "Web Deploy installer downloaded"
	#   Write-Output "- Execute $wd_installer_file and choose the [Complete] option to install all components"
	#   Write-Output ""
	#
	#}
	#Catch
	#{
	#   Write-Output ( $_.Exception.ToString() )
	#   Break
	#}
}

Import-Module WebAdministration

Remove-WebSite -Name "KockpitStudioSite" 
Remove-WebAppPool "KockpitStudioAppPool"
New-WebAppPool -name "KockpitStudioAppPool"  -force

Set-ItemProperty IIS:\AppPools\KockpitConfiguratorAppPool managedRuntimeVersion v4.0

$appPool = Get-IISAppPool -name "KockpitStudioAppPool" 
$appPool.processModel.identityType = "NetworkService"
$appPool.enable32BitAppOnWin64 = 1


new-WebSite -name "KockpitStudioSite" -PhysicalPath "C:\KockpitStudio\Packages\WebService" -Port 5000 -ApplicationPool "KockpitStudioAppPool" -force
iisreset

