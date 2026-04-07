const PRODUCTS = [
  {
    id: 'cosmo-naxo',
    name: 'Cosmo (Naxo)',
    category: 'Cheat',
    tags: ['apex','eft','rust','dayz'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'DISABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Apex, EFT, Rust (ALL)\nDayZ (25h2 & 24h2 not supported)',
    otherRequirements: [
      'UEFI BIOS',
      'Visuals installed (*visual)',
      'Core Isolation OFF',
      'Fastboot disabled in BIOS & Windows'
    ],
    fixes: [
      {
        title: 'Hyper-V Error',
        content: 'Use the *cosmohyperv command.',
        commands: ['*cosmohyperv']
      },
      {
        title: 'Fastboot / Hiberboot',
        content: 'Copy-paste to customer:',
        codeBlocks: [
          'Open CMD as Admin and type:\nreg add "HKLM\\System\\CurrentControlSet\\Control\\Session Manager\\Power" /v "HiberbootEnabled" /t REG_DWORD /d "1" /f',
          'Then type:\npowercfg -h on',
          'Then go to: Control Panel → Hardware and Sound → Change What Power Buttons Do → Turn Off Fast Start Up'
        ]
      },
      {
        title: 'Mapping Driver Failed',
        content: 'Add this file to: C:\\Windows\\System32\\drivers then restart your PC.',
        links: ['https://mega.nz/file/TB1A0bbZ#oLP83kATOQzucyzfaHrtAE4-JD5-U3OblZ1VnzXVwDY']
      },
      {
        title: 'Driver Does Not Seem to Be Running / Contact Support',
        content: 'Navigate to: Computer\\HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Memory Management and remove LargePageDrivers.\nThen check C:\\Windows\\System32\\drivers and delete PMAD again.\nIf still unfixable, @ Senior Support — use *naxoticket command to add Naxo to the ticket.',
        commands: ['*naxoticket']
      }
    ]
  },
  {
    id: 'cosmo-pro',
    name: 'Cosmo Pro',
    category: 'Cheat',
    tags: ['warthunder','apex','all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows except 25h2\n(Warthunder & Apex)',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      'Fastboot disabled in BIOS & Windows'
    ],
    fixes: [
      {
        title: 'Hyper-V Error',
        content: 'Use the *cosmohyperv command.',
        commands: ['*cosmohyperv']
      },
      {
        title: 'Warthunder Stuck at 15%',
        content: 'Copy the file path of Warthunder and paste it into the loader.'
      },
      {
        title: 'Website Opens but Error Persists — Install Python Manually',
        content: 'Follow these steps:',
        codeBlocks: [
          '1. Download python.zip from: http://warchill.xyz/python.zip',
          '2. Go to the temp folder: C:\\Users\\USERNAME\\AppData\\Local\\Temp and create a "python" folder there.',
          '3. Unzip the python.zip archive into the temp/python folder.',
          '4. Run the loader as admin again.'
        ]
      }
    ]
  },
  {
    id: 'atlas',
    name: 'Atlas',
    category: 'Cheat',
    tags: ['cod','all games','pubg'],
    requirements: {
      'TPM': '(N/A) (ENABLED for COD)',
      'Secure Boot': 'DISABLED (except COD)',
      'Virtualization': 'DISABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'ENABLED (DEFAULT)'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off'
    ],
    fixes: [
      {
        title: 'Meltdown / Spectre Protection Error',
        content: 'Download InSpectre, disable meltdown and spectre protection. Then go to C:/ find RSCFG folder and delete temp. restart pc and try again.',
        links: ['https://www.guru3d.com/download/download-inspectre/']
      },
      {
        title: 'Blue Screens',
        content: 'Disable build in spoofer'
      },
      {
        title: 'Failed to Load Driver',
        content: 'Open CMD as admin run sfc /scannow also check core isolation to be disabled.',
        codeBlocks: ['sfc /scannow']
      },
      {
        title: 'Fatal Error — Engine Error',
        content: 'Open rivatuner and set detection level as none'
      },
      {
        title: 'PUBG Blackscreen',
        content: 'C:\\x86)\\Steam\\steamapps\\common\\PUBG\\TslGame\\Content\\Movies delete Movies folder.'
      }
    ]
  },
  {
    id: 'forge',
    name: 'Forge',
    category: 'Cheat',
    tags: ['all games','eac'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'DISABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off'
    ],
    fixes: [
      {
        title: 'BSOD',
        content: 'Run the following commands in CMD as admin:',
        codeBlocks: [
          'sfc /scannow',
          'DISM.exe /Online /Cleanup-image /Restorehealth'
        ]
      },
      {
        title: 'Loader Closes at 100%',
        content: 'Sync PC time'
      },
      {
        title: 'bedaisy.sys / easyanticheat.sys Error Fix',
        content: 'Run Loader before launching the game.'
      },
      {
        title: 'I2 Error Fix',
        content: 'Check all anti-virus/anti-cheats again, also ensure core isolation is disabled. Visuals are installed and the loader must be run as admin.'
      }
    ]
  },
  {
    id: 'astrozoom',
    name: 'Astrozoom',
    category: 'Cheat',
    tags: ['cod','all games'],
    requirements: {
      'TPM': '(N/A) (enabled for cod)',
      'Secure Boot': 'DISABLED (enabled for cod)',
      'Virtualization': 'DISABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Windows 10 22h2 - Windows 11 23h2\nOnly COD supports 24h2 and 25h2',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off'
    ],
    fixes: [
      {
        title: 'Loading mem_ctx',
        content: 'Ensure that all Anti-Cheats and Anti-Virus software are uninstalled, including programs like: FaceIT, Vanguard, Anti-Cheat Expert and Kaspersky, McAfee, Malwarebytes.'
      },
      {
        title: 'Context Error #13 / Error 0x2',
        content: 'Unsupported windows version.'
      },
      {
        title: 'Ntherr / Nreq Error',
        content: 'Check if customer is not on a Virtual Machine/Desktop.'
      },
      {
        title: 'Connection errors timeout reached/couldn't resolve hostname',
        content: 'Use a VPN like Warp/Tunnelbear.'
      }
    ]
  },
  {
    id: 'supreme',
    name: 'Supreme',
    category: 'Cheat',
    tags: ['all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'ENABLED (Default)'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off'
    ],
    fixes: [
      {
        title: 'Invalid Processed Data 0x0',
        content: 'Use a VPN to fix, it\'s caused by ISP blocking the connection.'
      },
      {
        title: 'Error #3B000000',
        content: 'Turn off Core Isolation and run this command in CMD as admin:',
        codeBlocks: ['bcdedit /set hypervisorlaunchtype off']
      },
      {
        title: 'Error Code 0x1/0x2',
        content: 'Uninstall any Anti-Cheat and restart your PC.'
      },
      {
        title: 'Error Code 0x3/0x7',
        content: 'Spoofed before inject, restart PC then inject first.'
      }
    ]
  },
  {
    id: 'kane',
    name: 'Kane',
    category: 'Cheat',
    tags: ['rust','apex','pubg','dark and darker'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'ENABLED (Default)'
    },
    supportedWindows: 'Supports ALL windows version',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      'Nvidia/AMD overlay',
      'Steelseries for the following games: Rust, Apex, Dark and Darker, The Midnight Walkers and PUBG'
    ],
    fixes: [
      {
        title: 'Please download and install the latest vc_redist libs',
        content: 'Use command:',
        commands: ['*kaneamdmenufix']
      },
      {
        title: 'SVM/VMX Error',
        content: 'Disable windows pin. (*pin command) after follow *iobit command.',
        commands: ['*pin', '*iobit'],
        links: ['https://www.youtube.com/watch?v=L-55o0UnHFU']
      },
      {
        title: 'No menu',
        content: 'Update all drivers for GPU, Windows and make all visuals are installed. Disable all other overlays. Also don\'t run steam or the game itself as admin!'
      }
    ]
  },
  {
    id: 'liquid',
    name: 'Liquid',
    category: 'Cheat',
    tags: ['eft','arc raiders','all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'ENABLED (Default)'
    },
    supportedWindows: 'Supports ALL windows version',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      'EFT CHAMS PRESS F1 IN MAIN MENU TO INJECT',
      'ARC Raiders - Steam only'
    ],
    fixes: [
      {
        title: 'Steelseries',
        content: 'You need to use steelseries.com/gg: GENERAL > General section, turn on Sonar, then go to the SONAR > Shortcuts tab, put the "F7" key on the Master - Volume Up, you need to press this bind before injection.'
      },
      {
        title: 'SVM/VMX Error',
        content: 'Disable windows pin. (*pin command) after follow *iobit command',
        commands: ['*pin', '*iobit']
      },
      {
        title: 'No menu',
        content: 'Update all drivers for GPU, Windows and make all visuals are installed. Disable all other overlays. Also don\'t run steam or the game itself as admin!'
      }
    ]
  },
  {
    id: 'proaim',
    name: 'ProAim',
    category: 'Cheat',
    tags: ['all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      'For AMD ensure NX Mode in bios is enabled (when getting hypervisor error after applying the fix).'
    ],
    fixes: [
      {
        title: 'No menu / BSOD',
        content: 'Send them new loader from: https://t.me/fecloaders\nIf still BSOD with latest loader, send them *delay command.\nHave them add this file to the loader, and run the file.'
      },
      {
        title: 'Still BSOD? Get Minidump File',
        content: 'Go to C:\\Windows\\Minidump → find the latest created file → copy it to desktop → send it to support.',
        codeBlocks: ['C:\\Windows\\Minidump']
      }
    ]
  },
  {
    id: 'cobra',
    name: 'Cobra',
    category: 'Cheat',
    tags: ['all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'DISABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off'
    ],
    fixes: [
      {
        title: 'Mapping driver failed',
        content: 'Disable all anti-cheats & anti-virus. Feel free to use *defendercontrol to make sure all is disabled.',
        commands: ['*defendercontrol']
      },
      {
        title: 'Loader connection issues',
        content: 'Use PROTON VPN.'
      },
      {
        title: 'Crashing / BSOD',
        content: 'Make sure they selected the download with no-spoofer. EAC spoofer is not working. If they want to use the BE spoofer, have them disable TPM.'
      },
      {
        title: 'Overlay',
        content: 'Disable all overlays! Discord, Steam, Medal, Nvidia / AMD etc.'
      }
    ]
  },
  {
    id: 'athena',
    name: 'Athena',
    category: 'Cheat',
    tags: ['marvel','pubg','ow2','naraka','arc raiders'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'DISABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions except:\nMarvel, PUBG, OW2 and Naraka 22h2 w10 only',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      'ARC: is steam only, and DX12 must be used'
    ],
    fixes: [
      {
        title: 'Error code 2145/2146',
        content: 'Tell a Senior to contact developer, the uploaded file was corrupted during upload.'
      },
      {
        title: 'Crashing loader',
        content: 'Paste this code into cmd as an administrator, then restart your computer. Change the "aaaaa14" part here as you wish, but all letters must be lowercase.',
        codeBlocks: ['wmic computersystem where name="%computername%" call rename name="aaaaa14"']
      }
    ]
  },
  {
    id: 'kraken-games',
    name: 'Kraken (Games)',
    category: 'Cheat',
    tags: ['dayz','roblox','all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': '(N/A)',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions\nDayZ 25h2 & 24h2 not supported',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off'
    ],
    fixes: [
      {
        title: 'Nvidia overlay & Overwolf for AMD users',
        content: 'Disable Nvidia overlay and Overwolf for AMD users.'
      },
      {
        title: 'Roblox',
        content: 'Download the game from https://www.fishstrap.app where it prevents downloading any silent beta updates every few hours which breaks the product.',
        links: ['https://www.fishstrap.app']
      }
    ]
  },
  {
    id: 'kraken-spoofer',
    name: 'Kraken Spoofer',
    category: 'Spoofer',
    tags: ['spoofer','all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': '(N/A)',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      '*defendercontrol'
    ],
    fixes: [
      {
        title: 'No Hardware Virtualization Capabilities Found / Hyper-V Running',
        content: 'Go to "Turn Windows Features On or Off" and disable Hyper-V.',
        commands: ['*cosmohyperv']
      },
      {
        title: 'Loader stuck at 11%',
        content: 'Run in powershell as admin:\nGet-Volume | Where-Object DriveLetter | ForEach-Object { $drive = $_.DriveLetter; Write-Host "Running chkdsk on drive $drive..."; chkdsk "$drive`:" /F }'
      }
    ]
  },
  {
    id: 'inferno',
    name: 'Inferno',
    category: 'Cheat',
    tags: ['all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': '(N/A)',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off'
    ],
    fixes: [
      {
        title: 'Driver initialization Error 1',
        content: 'You need to download this file https://mega.nz/file/uURS0ZgL#gn9i_rBW__80V9uzexA_Cr2vPUPNGQK2aif4qtevXHs . Run the file and restart your PC, then try to run the cheat again. You also need to disable core isolation and Vulnerable Driver Blocking in Windows Defender; And if that didn\'t help, then click "Get Support" in the loader, select "Driver Error," and restart PC'
      }
    ]
  },
  {
    id: 'pulse',
    name: 'Pulse',
    category: 'Cheat',
    tags: ['arc raiders','all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'DISABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off'
    ],
    fixes: [
      {
        title: 'Injection failed (0x1394) (ARC Raiders)',
        content: 'Close chrome and try with another browser, opera recommended\n- If still not working try this: 1)https://download.overwolf.com/install/Download?utm_content=new-light&utm_source=web_app_store 2) Go to task manager> startup apps and disable EVERYTHING. Restart PC after.\n3) Make sure all game launchers are completely closed>EA/STEAM/BNET.\n4) Open overwolf and disable all its overlays. Once done, minimize it to icon tray. \n5) Open loader as admin and inject the cheat, wait for success message (HANDLE SUCCESSFULLY SENT) \n6) Once done, open steam and launch game'
      }
    ]
  },
  {
    id: 'hero-valorant',
    name: 'Hero Valorant',
    category: 'Cheat',
    tags: ['valorant'],
    requirements: {
      'TPM': 'ENABLED',
      'Secure Boot': 'ENABLED',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DEFAULT'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      '*visual',
      '*defendercontrol',
      '*coreisoval',
      'Medal.TV overlay',
      'GPU Drivers up to date',
      'HYPER V ON(IN WINDOWS FEATURES)'
    ],
    fixes: [
      {
        title: 'No menu',
        content: 'Install Medal.TV and make sure record with medal is on.\nPlease make sure that Valorant Launcher is not open during inject.',
        commands: ['*coreisoval']
      },
      {
        title: 'Still no menu?',
        content: 'Download this: https://gofile.io/d/sOW8lX and have them run it as admin. It will create a file named bundle.enc, have them send it in the ticket and @ Seniors to forward to the developer.',
        links: ['https://gofile.io/d/sOW8lX']
      },
      {
        title: 'Secure Boot policy fix',
        content: 'Go to BIOS -> Secure Boot -> Key Management -> Forbidden Signatures(dbx) -> Delete, then press No and delete signatures that you have there (it should be 2-5 signatures) \nMake sure secure boot mode: Custom\n\nDon\'t press DELETE ALL SIGNATURES or DELETE ALL\n\nYou should delete 1 by 1.'
      }
    ]
  },
  {
    id: 'hero-ow2',
    name: 'Hero OW2',
    category: 'Cheat',
    tags: ['overwatch 2','ow2'],
    requirements: {
      'TPM': 'N/A',
      'Secure Boot': 'N/A',
      'Virtualization': 'N/A',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      '*visual',
      '*defendercontrol',
      'Core Isolation disabled',
      'Reputation based protection too',
      'Exploit too',
      'GPU Drivers up to date',
      'Run loader as admin',
      'DISABLE ALL OVERLAYS',
      'Put DX11 in overwatch 2'
    ],
    fixes: [
      {
        title: 'Latest loader',
        content: 'https://mega.nz/folder/VUdnFYCC#Y3MUZeXJl_vkQt5hjvgvXw'
      },
      {
        title: 'Fix to External Overlay error',
        content: '1. Disable Discord overlay (Settings → Game Activity → Overlay toggle)\n2. Close OBS / switch from Game Capture to Window Capture\n3. Disable GeForce Experience overlay (Alt+Z → Settings → In-Game Overlay → Off)\n4. Disable Xbox Game Bar (Windows Settings → Gaming → Xbox Game Bar → Off)'
      },
      {
        title: 'Graphic game crash',
        content: 'Sent the following 2 screenshots:\nGraphics: https://imgur.com/a/Jf9L64C\nOverlay crash: https://imgur.com/a/ixjO37i'
      },
      {
        title: 'Aimbot or ESP not working',
        content: 'Select the default preset in the menu for aimbot & for esp: Reload the cheat within the menu.'
      }
    ]
  },
  {
    id: 'hero-delta-force',
    name: 'Hero Delta Force',
    category: 'Cheat',
    tags: ['delta force'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'ENABLED',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      '*defendercontrol',
      'Steam only',
      'DX12 only'
    ],
    fixes: [
      {
        title: 'Before injecting ensure that',
        content: 'In Delta Force the display is set to WF/Borderless.\nSuper resolution/upscaling OFF'
      },
      {
        title: 'Loader crashes after key verification',
        content: 'Install the latest Microsoft Visual C++ Redistributable packages (both x86 and x64):\nhttps://aka.ms/vs/17/release/vc_redist.x64.exe\nhttps://aka.ms/vs/17/release/vc_redist.x86.exe'
      },
      {
        title: 'Random Crashes / Freezes',
        content: 'Put lowest graphics, set a stable FPS cap, Disable Super Resolution / DLSS / FSR.'
      },
      {
        title: 'No menu',
        content: 'Download this: https://gofile.io/d/sOW8lX and have them run it as admin. It will create a file named bundle.enc, have them send it in the ticket and @ Seniors to forward to the developer.',
        links: ['https://gofile.io/d/sOW8lX']
      }
    ]
  },
  {
    id: 'hero-fn-rust-apex',
    name: 'Hero FN, Rust, Apex, ABI, ARC',
    category: 'Cheat',
    tags: ['fortnite','rust','apex','abi','arc raiders'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': '(N/A)',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DEFAULT'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      'ALL NEED Medal.TV',
      'Hyper V enabled for: ARC Raiders, Valorant, Fortnite and Apex'
    ],
    fixes: [
      {
        title: 'BSOD for Apex',
        content: 'https://go.microsoft.com/fwlink/?linkid=2335869\nEnsure file path is: C:\\Program Files (x86)\\Windows Kits\\10\\\nAlso make sure to always generate new build.'
      },
      {
        title: 'Still no menu or errors?',
        content: 'Download this: https://gofile.io/d/sOW8lX and have them run it as admin. It will create a file named bundle.enc, have them send it in the ticket and @ Seniors.'
      },
      {
        title: 'Arena Breakout ENC:ON',
        content: 'To many reports, change account. It will go away after 12-24hours.'
      },
      {
        title: 'Rust & FN requirement',
        content: 'https://go.microsoft.com/fwlink/?linkid=2335869'
      }
    ]
  },
  {
    id: 'volt',
    name: 'VOLT',
    category: 'Cheat',
    tags: ['dayz','eft','rust','all games'],
    requirements: {
      'TPM': 'DISABLED',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      '*pin removed for TPM',
      'HVIX & HVAX in system32 (usually only removed if user used Kane before). '
    ],
    fixes: [
      {
        title: 'Framework error',
        content: 'https://builds.dotnet.microsoft.com/dotnet/Runtime/7.0.5/dotnet-runtime-7.0.5-win-x64.exe\nhttps://builds.dotnet.microsoft.com/dotnet/Runtime/7.0.5/dotnet-runtime-7.0.5-win-x86.exe'
      },
      {
        title: 'No ESP DayZ & EFT',
        content: 'DayZ: settings > video > Disable: "POSTPROCESS ANTIALIASING" & "HARDWARE ANTIALIASING"\nEFT: Settings > game > find the option "Autoclean RAM" disable it. '
      },
      {
        title: 'Keybinds for Rust Lite',
        content: 'F5 for ESP, F6 for no recoil and F9 for remove walls.'
      },
      {
        title: 'Legacy BIOS/ Boot part not GPT',
        content: 'https://youtu.be/a54sqzcDrUU?si=Lj2PE-bUK2bLBMEg'
      },
      {
        title: 'Errors that require reinstall windows',
        content: 'Error 1,3,4,5,6,7 (all related to boot partitions)'
      },
      {
        title: 'HVIX/HVAX not found',
        content: 'Run sfc /scannow in CMD as admin.',
        codeBlocks: ['sfc /scannow']
      }
    ]
  },
  {
    id: 'vex',
    name: 'VEX',
    category: 'Cheat',
    tags: ['warthunder','all games'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'DISABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Windows 10 22H2 > Windows 11 23H2',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      '*defendercontrol'
    ],
    fixes: [
      {
        title: 'VEX Warthunder',
        content: 'Must be run in DX11. Add -D3D11 to launch parameters.'
      },
      {
        title: 'Connection issue?',
        content: 'https://pcheck.ru/files/networkmanager.zip\n⏺ Run it.\n⏺ Select the "Find the Best IP" option.\n⏺ Wait for the check to complete.\n⏺ Click "Apply".'
      }
    ]
  },
  {
    id: 'crown',
    name: 'Crown',
    category: 'Cheat',
    tags: ['cod','marvels','all games'],
    requirements: {
      'TPM': 'DISABLED (except COD)',
      'Secure Boot': 'DISABLED (except COD)',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      '*defendercontrol'
    ],
    fixes: [
      {
        title: 'Marvels',
        content: 'Run a notepad as admin before injecting cheat.'
      },
      {
        title: 'Marvels 25h2',
        content: 'Marvels 25h2 unstable.'
      }
    ]
  },
  {
    id: 'opal-fivem',
    name: 'Opal (FiveM)',
    category: 'Cheat',
    tags: ['fivem','gta'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': '(N/A)',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      '*defendercontrol',
      'Steam overlay enabled',
      'FiveM version release'
    ],
    fixes: [
      {
        title: 'Injections issues',
        content: 'Error 1-4: Download/Timeout Error | Fix : Use a VPN\nError 2 : Integrity Error | Fix : Reinstall FiveM\nError 3 : Injection Error | Anti-cheats / Anti-virus blocking the injection.'
      },
      {
        title: 'Cheat issues',
        content: 'Display Settings can\'t be Fullscreen Exclusive, it will cause crashes.\nSteam needs to be open with steam overlay enabled.'
      },
      {
        title: 'How to inject',
        content: 'Open FiveM with steam running on background (just need to be open) > open the loader and log in using the key > inject the cheat and done! Users can inject inside of a server too (Open game > Join server > Inject)'
      }
    ]
  },
  {
    id: 'opal-other',
    name: 'Opal (except FiveM)',
    category: 'Cheat',
    tags: ['all games','spoofer'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': '(N/A)',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'UEFI Bios',
      'Visuals installed (*visual)',
      'Core Isolation off',
      '*defendercontrol'
    ],
    fixes: [
      {
        title: 'Fatal error! Connection error',
        content: 'Open date and time settings, sync pc time.'
      },
      {
        title: 'BSOD',
        content: 'Disable all anti-virus, you can use this: https://antivirus-removal-tool.com/\nIf issue persists, uninstall any mouse/keyboard software. (Razer, Armory Crate)'
      },
      {
        title: '2 Beeps when pressing F2 and game crashes',
        content: 'Remove all modifications, including Reshade / Redux.\nReinstall the game if the issue persists with Revo-Uninstaller. '
      },
      {
        title: 'Status 502 [Internal server error]',
        content: 'Server is down, change the server with by doing this:\nCreate shortcut on desktop of the loader, open properties > on the line of target: add at the end: –diagnostic \nReopen the shortcut loader, select a different server and try again.'
      }
    ]
  },
  {
    id: 'viper',
    name: 'Viper',
    category: 'Cheat',
    tags: ['all games','arc raiders','steam'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': '(N/A)',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'Use Default'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'ALL ANTI-VIRUS OFF',
      'Windows Defender-Smartscreen-Core isolation-',
      '(Use *defendercontrol)',
      'Disable all overlays! ',
      '(Discord,Nvidia,Overwolf,Reshade,RivaTuner)',
      'Must run steam as admin! Don\'t use any launch parameters! (Right click the game > properties to check).',
      'Disable Frame Generation and Nvidia Reflex in games that support it. (Check game settings).',
      'Also don\'t use any Nvidia filters.',
      'Product is STEAM ONLY. Except ARC Raiders',
      'Close background apps or disable in startup.',
      'Visuals installed (*visual)',
      'Windows up to date.',
      'GPU driver up to date.'
    ],
    fixes: [
      {
        title: 'Failed to stream please check connection',
        content: 'Use a VPN.'
      },
      {
        title: 'Extra step The Isle Evrima',
        content: 'Delete %localappdata%\\TheIsle\\Saved Folder',
        codeBlocks: ['%localappdata%\\TheIsle\\Saved']
      },
      {
        title: 'Extra step Arc Raiders',
        content: 'Delete %localappdata%\\PioneerGame\\Saved Folder',
        codeBlocks: ['%localappdata%\\PioneerGame\\Saved']
      },
      {
        title: 'Troubleshoot tool',
        content: 'Run the troubleshoot tool: https://cdn.discordapp.com/attachments/1459056826317537397/1460873272760602848/Troubleshoot.exe'
      },
      {
        title: 'Failed to Stream',
        content: 'Set DNS to Cloudflare.'
      }
    ]
  },
  {
    id: 'breeze',
    name: 'Breeze',
    category: 'Cheat',
    tags: ['ark','r6','siege','spoofer'],
    requirements: {
      'TPM': '(N/A)',
      'Secure Boot': '(N/A)',
      'Virtualization': '(N/A)',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      'Reputation based protection,',
      'Core Isolation and Exploit off.',
      '(Use *defendercontrol)',
      'ARK: STEAM/EPIC ONLY',
      'Visuals installed (*visual)',
      'GPU drivers up to date.'
    ],
    fixes: [
      {
        title: 'Overlay for ARK',
        content: 'Legacy overlay discord (Enable overlay off)'
      },
      {
        title: 'Overlay for R6',
        content: 'Nvidia or AMD (Metrics Overlay)'
      },
      {
        title: 'Loader not opening',
        content: 'Sync PC Time & Use Warp VPN.\n(Also check installed programs for anti-virus) '
      },
      {
        title: 'W11 fix for spoofer',
        content: 'https://gofile.io/d/qVXmXC\nAll windows 11 users must run this to avoid BSOD\'s. \nJust tell them to extract the file, run as admin and click yes to all.\nRestart PC and then obviously clean if needed cleaning, and spoof.'
      },
      {
        title: 'For spoofer',
        content: 'ALSO DELETE LAST 2 WINDOWS SECURITY UPDATES!\n(Windows Update > Update History > Uninstall Updates)\nLook for Security updates and uninstall.'
      }
    ]
  },
  {
    id: 'vortex',
    name: 'Vortex',
    category: 'Cheat',
    tags: ['valorant','all games'],
    requirements: {
      'TPM': '(N/A) ON for games that require it',
      'Secure Boot': 'DISABLED',
      'Virtualization': 'ENABLED',
      'Windows Defender': 'DISABLED',
      'Windows Firewall': 'DISABLED',
      'Exploit Protection': 'DISABLED'
    },
    supportedWindows: 'Supports ALL windows versions',
    otherRequirements: [
      '*visual for all visuals',
      'Hyper-V enabled in win features',
      'Bios UEFI & Disks GPT',
      'All antivirus uninstalled (VGK, FaceIT, McAfee etc)',
      'Core isolation disabled'
    ],
    fixes: [
      {
        title: 'InitWindows Error!',
        content: 'Press F2 for injector only after you see discord overlay banner.\nALSO DON'T BE IN A DISCORD CALL WHEN USING DISCORD OVERLAY!\n(Have legacy overlay disabled)'
      },
      {
        title: 'LoadHyperVisor Error!',
        content: 'Hypervisor not loaded properly, follow this video: https://youtu.be/XYVeHy5u4j4'
      },
      {
        title: 'Error! Craft UEFI',
        content: 'Try making a partition (GPT) in disk management and boot from there, if not working reinstall windows.'
      },
      {
        title: 'Blackscreen Initialization',
        content: 'Disable TPM and re-check all setup for HyperVisor use. (YT Link)'
      },
      {
        title: 'Bad Image Libs',
        content: 'Solution: Files from the folder with the loader libcrypto-1_1-x64.dll and libssl-1_1-x64.dll replace them in C:\\Windows\\System32 and C:\\Windows\\INF'
      },
      {
        title: 'Secure boot bypass Valorant fix',
        content: 'https://gofile.io/d/JPNqIp\n1) WBCL.dat - drop in C:\\Windows\\System32 \n2) Run Start.exe as Admin \n3) Run Secure Boot Fix.bat'
      },
      {
        title: 'Unsupported 16-Bit Application',
        content: 'Screenshot of disabled Windows Defender (Real-time Protection), third-party anti-virus systems should also be REMOVED from the PC.\nDisable the firewall completely\nDelete Bypassing YouTube/Discord may interfere with the launch of the loader\nUse VPN for launching'
      }
    ]
  },
  {
    id: 'extra-fixes-kane',
    name: 'Extra Fixes — Kane',
    category: 'Extra Fixes',
    tags: ['kane','fixes'],
    requirements: {},
    supportedWindows: '',
    otherRequirements: [],
    fixes: [
      {
        title: 'no available servers were found',
        content: 'use vpn'
      },
      {
        title: 'crd failed at 199 with code 887a0001',
        content: 'try disabling integrated gpu, if that doesn\'t work or doesn\'t have any other gpu than integrated gpu then refund'
      },
      {
        title: 'required resource not found',
        content: 'start cheat after spoofer'
      },
      {
        title: 'failed to prepare environment(1)',
        content: 'restart pc and try again'
      },
      {
        title: 'error 0x298',
        content: 'contact dev'
      },
      {
        title: 'failed to inject the cheat(12)',
        content: 'try pressing ok and entering the game and see if it works'
      }
    ]
  },
  {
    id: 'extra-rare-fixes',
    name: 'Extra Rare Fixes',
    category: 'Extra Fixes',
    tags: ['cosmo','rust'],
    requirements: {},
    supportedWindows: '',
    otherRequirements: [],
    fixes: [
      {
        title: 'Occlusion culling off in Experimental settings for COSMO RUST.'
      }
    ]
  },
  {
    id: 'tos-refunds',
    name: 'T.O.S. / Refunds / Compensation / HWID Reset',
    category: 'Policy',
    tags: ['tos','refund','hwid','compensation'],
    requirements: {},
    supportedWindows: '',
    otherRequirements: [],
    fixes: [
      {
        title: 'Refunds',
        content: 'When refunding please ask for key, order number, key length, and what game.'
      },
      {
        title: 'Eligible refund reasons',
        content: 'Insta banned without being able to use the product. (Check if user wasn\'t banned before or double injected)\n\nIf user falls under these conditions then we can refund, if user doesn\'t fit then kindly explain why and what they did wrong and mention how to remove ban with spoofer and new account.'
      },
      {
        title: 'Corrupted PC',
        content: 'When a user uses something and it wipes their pc, then we usually refund. Some developers have fixes though. (So no refund)'
      },
      {
        title: 'Updating',
        content: 'If a product has been updating for a while, and people as for a refund please say to wait. \nIf a insane amount of users make tickets about it and product been taking a long time without update, we might refund in some cases.'
      },
      {
        title: 'Downgrading',
        content: 'We can refund some products if user does not wanna downgrade, but we rather have user downgrade.\nYou can convince them to backup important files with something like onedrive or a USB. If user continues to want refund please @ a senior support - You can always ask a senior if you can refund.'
      },
      {
        title: 'Compensations',
        content: 'We can comp users keys for most reasons, like:\n- losing time from troubleshooting, when a product was updating or not working.\n- We WON\'T comp keys if they have been comped more than once already, we won\'t comp little time like 1-2 hours.\n- Some devs take time to comp keys so please make sure you dont "Ghost" the user and reply to them that we are still waiting for developers.'
      },
      {
        title: 'HWID Resets',
        content: 'Ask Senior Support or some support with reset access.'
      }
    ]
  }
];

if (typeof module !== 'undefined') module.exports = PRODUCTS;
