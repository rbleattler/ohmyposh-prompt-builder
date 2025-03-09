/**
 * This file was automatically generated from the Oh My Posh schema.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run the 'generate-schema-types' script to regenerate this file.
 *
 * Generated on: 2025-03-06T14:34:54.203Z
 */

import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import FolderIcon from '@mui/icons-material/Folder';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BatteryChargingFullIcon from '@mui/icons-material/BatteryChargingFull';
import ComputerIcon from '@mui/icons-material/Computer';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TerminalIcon from '@mui/icons-material/Terminal';
import CloudIcon from '@mui/icons-material/Cloud';
import ShieldIcon from '@mui/icons-material/Shield';
import DevicesIcon from '@mui/icons-material/Devices';
import MemoryIcon from '@mui/icons-material/Memory';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

// Define segment type with icons and descriptions
export interface SegmentTypeDefinition {
  type: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  defaultProperties: Record<string, any>;
}

// Segment types extracted from schema
export const SEGMENT_TYPES: SegmentTypeDefinition[] = [
  {
    "type": "angular",
    "name": "Angular",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "argocd",
    "name": "Argocd",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "aurelia",
    "name": "Aurelia",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "aws",
    "name": "Aws",
    "icon": null,
    "description": "Shows AWS profile information",
    "defaultProperties": {}
  },
  {
    "type": "az",
    "name": "Az",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "azd",
    "name": "Azd",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "azfunc",
    "name": "Azfunc",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "battery",
    "name": "Battery",
    "icon": null,
    "description": "Shows battery status",
    "defaultProperties": {
      "display_charging": true
    }
  },
  {
    "type": "bazel",
    "name": "Bazel",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "brewfather",
    "name": "Brewfather",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "buf",
    "name": "Buf",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "bun",
    "name": "Bun",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "carbonintensity",
    "name": "Carbonintensity",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "cds",
    "name": "Cds",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "cf",
    "name": "Cf",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "cftarget",
    "name": "Cftarget",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "cmake",
    "name": "Cmake",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "command",
    "name": "Command",
    "icon": null,
    "description": "Executes and displays command output",
    "defaultProperties": {
      "command": "echo Hello",
      "shell": "pwsh"
    }
  },
  {
    "type": "connection",
    "name": "Connection",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "crystal",
    "name": "Crystal",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "dart",
    "name": "Dart",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "deno",
    "name": "Deno",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "docker",
    "name": "Docker",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "dotnet",
    "name": "Dotnet",
    "icon": null,
    "description": "Shows .NET version",
    "defaultProperties": {}
  },
  {
    "type": "elixir",
    "name": "Elixir",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "executiontime",
    "name": "Executiontime",
    "icon": null,
    "description": "Shows command execution time",
    "defaultProperties": {}
  },
  {
    "type": "firebase",
    "name": "Firebase",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "flutter",
    "name": "Flutter",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "fortran",
    "name": "Fortran",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "fossil",
    "name": "Fossil",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "gcp",
    "name": "Gcp",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "git",
    "name": "Git",
    "icon": null,
    "description": "Shows Git repository information",
    "defaultProperties": {
      "branch_icon": "",
      "display_status": true
    }
  },
  {
    "type": "gitversion",
    "name": "Gitversion",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "go",
    "name": "Go",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "haskell",
    "name": "Haskell",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "helm",
    "name": "Helm",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "ipify",
    "name": "Ipify",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "java",
    "name": "Java",
    "icon": null,
    "description": "Shows Java version",
    "defaultProperties": {}
  },
  {
    "type": "julia",
    "name": "Julia",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "kotlin",
    "name": "Kotlin",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "kubectl",
    "name": "Kubectl",
    "icon": null,
    "description": "Shows Kubernetes context",
    "defaultProperties": {}
  },
  {
    "type": "lastfm",
    "name": "Lastfm",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "lua",
    "name": "Lua",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "mercurial",
    "name": "Mercurial",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "mojo",
    "name": "Mojo",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "mvn",
    "name": "Mvn",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "nbgv",
    "name": "Nbgv",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "nightscout",
    "name": "Nightscout",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "nim",
    "name": "Nim",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "nix-shell",
    "name": "Nix-shell",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "node",
    "name": "Node",
    "icon": null,
    "description": "Shows Node.js version",
    "defaultProperties": {}
  },
  {
    "type": "npm",
    "name": "Npm",
    "icon": null,
    "description": "Shows NPM package information",
    "defaultProperties": {}
  },
  {
    "type": "nx",
    "name": "Nx",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "ocaml",
    "name": "Ocaml",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "os",
    "name": "Os",
    "icon": null,
    "description": "Shows operating system information",
    "defaultProperties": {}
  },
  {
    "type": "owm",
    "name": "Owm",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "path",
    "name": "Path",
    "icon": null,
    "description": "Shows current directory path",
    "defaultProperties": {
      "style": "folder",
      "max_width": 0
    }
  },
  {
    "type": "perl",
    "name": "Perl",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "php",
    "name": "Php",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "plastic",
    "name": "Plastic",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "pnpm",
    "name": "Pnpm",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "project",
    "name": "Project",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "pulumi",
    "name": "Pulumi",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "python",
    "name": "Python",
    "icon": null,
    "description": "Shows Python version",
    "defaultProperties": {}
  },
  {
    "type": "quasar",
    "name": "Quasar",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "r",
    "name": "R",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "react",
    "name": "React",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "root",
    "name": "Root",
    "icon": null,
    "description": "Shows a root/admin indicator",
    "defaultProperties": {}
  },
  {
    "type": "ruby",
    "name": "Ruby",
    "icon": null,
    "description": "Shows Ruby version",
    "defaultProperties": {}
  },
  {
    "type": "rust",
    "name": "Rust",
    "icon": null,
    "description": "Shows Rust version",
    "defaultProperties": {}
  },
  {
    "type": "sapling",
    "name": "Sapling",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "session",
    "name": "Session",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "shell",
    "name": "Shell",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "sitecore",
    "name": "Sitecore",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "spotify",
    "name": "Spotify",
    "icon": null,
    "description": "Shows currently playing Spotify track",
    "defaultProperties": {}
  },
  {
    "type": "status",
    "name": "Status",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "strava",
    "name": "Strava",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "svelte",
    "name": "Svelte",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "svn",
    "name": "Svn",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "swift",
    "name": "Swift",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "sysinfo",
    "name": "Sysinfo",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "talosctl",
    "name": "Talosctl",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "tauri",
    "name": "Tauri",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "terraform",
    "name": "Terraform",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "text",
    "name": "Text",
    "icon": null,
    "description": "Shows static text",
    "defaultProperties": {
      "text": "Hello"
    }
  },
  {
    "type": "time",
    "name": "Time",
    "icon": null,
    "description": "Shows current time",
    "defaultProperties": {
      "format": "15:04:05"
    }
  },
  {
    "type": "ui5tooling",
    "name": "Ui5tooling",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "umbraco",
    "name": "Umbraco",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "unity",
    "name": "Unity",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "upgrade",
    "name": "Upgrade",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "v",
    "name": "V",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "vala",
    "name": "Vala",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "wakatime",
    "name": "Wakatime",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "winreg",
    "name": "Winreg",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "withings",
    "name": "Withings",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "xmake",
    "name": "Xmake",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "yarn",
    "name": "Yarn",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "ytm",
    "name": "Ytm",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  },
  {
    "type": "zig",
    "name": "Zig",
    "icon": null,
    "description": "Configurable segment",
    "defaultProperties": {}
  }
];

// Replace icon placeholders with actual React components
SEGMENT_TYPES[0].icon = <CodeIcon />;
SEGMENT_TYPES[1].icon = <CodeIcon />;
SEGMENT_TYPES[2].icon = <CodeIcon />;
SEGMENT_TYPES[3].icon = <CloudIcon />;
SEGMENT_TYPES[4].icon = <CodeIcon />;
SEGMENT_TYPES[5].icon = <CodeIcon />;
SEGMENT_TYPES[6].icon = <CodeIcon />;
SEGMENT_TYPES[7].icon = <BatteryChargingFullIcon />;
SEGMENT_TYPES[8].icon = <CodeIcon />;
SEGMENT_TYPES[9].icon = <CodeIcon />;
SEGMENT_TYPES[10].icon = <CodeIcon />;
SEGMENT_TYPES[11].icon = <CodeIcon />;
SEGMENT_TYPES[12].icon = <CodeIcon />;
SEGMENT_TYPES[13].icon = <CodeIcon />;
SEGMENT_TYPES[14].icon = <CodeIcon />;
SEGMENT_TYPES[15].icon = <CodeIcon />;
SEGMENT_TYPES[16].icon = <CodeIcon />;
SEGMENT_TYPES[17].icon = <TerminalIcon />;
SEGMENT_TYPES[18].icon = <CodeIcon />;
SEGMENT_TYPES[19].icon = <CodeIcon />;
SEGMENT_TYPES[20].icon = <CodeIcon />;
SEGMENT_TYPES[21].icon = <CodeIcon />;
SEGMENT_TYPES[22].icon = <CodeIcon />;
SEGMENT_TYPES[23].icon = <DevicesIcon />;
SEGMENT_TYPES[24].icon = <CodeIcon />;
SEGMENT_TYPES[25].icon = <AccessTimeIcon />;
SEGMENT_TYPES[26].icon = <CodeIcon />;
SEGMENT_TYPES[27].icon = <CodeIcon />;
SEGMENT_TYPES[28].icon = <CodeIcon />;
SEGMENT_TYPES[29].icon = <CodeIcon />;
SEGMENT_TYPES[30].icon = <CodeIcon />;
SEGMENT_TYPES[31].icon = <GitHubIcon />;
SEGMENT_TYPES[32].icon = <CodeIcon />;
SEGMENT_TYPES[33].icon = <CodeIcon />;
SEGMENT_TYPES[34].icon = <CodeIcon />;
SEGMENT_TYPES[35].icon = <CodeIcon />;
SEGMENT_TYPES[36].icon = <CodeIcon />;
SEGMENT_TYPES[37].icon = <DevicesIcon />;
SEGMENT_TYPES[38].icon = <CodeIcon />;
SEGMENT_TYPES[39].icon = <CodeIcon />;
SEGMENT_TYPES[40].icon = <DevicesIcon />;
SEGMENT_TYPES[41].icon = <CodeIcon />;
SEGMENT_TYPES[42].icon = <CodeIcon />;
SEGMENT_TYPES[43].icon = <CodeIcon />;
SEGMENT_TYPES[44].icon = <CodeIcon />;
SEGMENT_TYPES[45].icon = <CodeIcon />;
SEGMENT_TYPES[46].icon = <CodeIcon />;
SEGMENT_TYPES[47].icon = <CodeIcon />;
SEGMENT_TYPES[48].icon = <CodeIcon />;
SEGMENT_TYPES[49].icon = <CodeIcon />;
SEGMENT_TYPES[50].icon = <DevicesIcon />;
SEGMENT_TYPES[51].icon = <DevicesIcon />;
SEGMENT_TYPES[52].icon = <CodeIcon />;
SEGMENT_TYPES[53].icon = <CodeIcon />;
SEGMENT_TYPES[54].icon = <ComputerIcon />;
SEGMENT_TYPES[55].icon = <CodeIcon />;
SEGMENT_TYPES[56].icon = <FolderIcon />;
SEGMENT_TYPES[57].icon = <CodeIcon />;
SEGMENT_TYPES[58].icon = <CodeIcon />;
SEGMENT_TYPES[59].icon = <CodeIcon />;
SEGMENT_TYPES[60].icon = <CodeIcon />;
SEGMENT_TYPES[61].icon = <CodeIcon />;
SEGMENT_TYPES[62].icon = <CodeIcon />;
SEGMENT_TYPES[63].icon = <DevicesIcon />;
SEGMENT_TYPES[64].icon = <CodeIcon />;
SEGMENT_TYPES[65].icon = <CodeIcon />;
SEGMENT_TYPES[66].icon = <CodeIcon />;
SEGMENT_TYPES[67].icon = <ShieldIcon />;
SEGMENT_TYPES[68].icon = <DevicesIcon />;
SEGMENT_TYPES[69].icon = <DevicesIcon />;
SEGMENT_TYPES[70].icon = <CodeIcon />;
SEGMENT_TYPES[71].icon = <CodeIcon />;
SEGMENT_TYPES[72].icon = <CodeIcon />;
SEGMENT_TYPES[73].icon = <CodeIcon />;
SEGMENT_TYPES[74].icon = <MusicNoteIcon />;
SEGMENT_TYPES[75].icon = <CodeIcon />;
SEGMENT_TYPES[76].icon = <CodeIcon />;
SEGMENT_TYPES[77].icon = <CodeIcon />;
SEGMENT_TYPES[78].icon = <CodeIcon />;
SEGMENT_TYPES[79].icon = <CodeIcon />;
SEGMENT_TYPES[80].icon = <CodeIcon />;
SEGMENT_TYPES[81].icon = <CodeIcon />;
SEGMENT_TYPES[82].icon = <CodeIcon />;
SEGMENT_TYPES[83].icon = <CodeIcon />;
SEGMENT_TYPES[84].icon = <TextFieldsIcon />;
SEGMENT_TYPES[85].icon = <AccessTimeIcon />;
SEGMENT_TYPES[86].icon = <CodeIcon />;
SEGMENT_TYPES[87].icon = <CodeIcon />;
SEGMENT_TYPES[88].icon = <CodeIcon />;
SEGMENT_TYPES[89].icon = <CodeIcon />;
SEGMENT_TYPES[90].icon = <CodeIcon />;
SEGMENT_TYPES[91].icon = <CodeIcon />;
SEGMENT_TYPES[92].icon = <CodeIcon />;
SEGMENT_TYPES[93].icon = <CodeIcon />;
SEGMENT_TYPES[94].icon = <CodeIcon />;
SEGMENT_TYPES[95].icon = <CodeIcon />;
SEGMENT_TYPES[96].icon = <CodeIcon />;
SEGMENT_TYPES[97].icon = <CodeIcon />;
SEGMENT_TYPES[98].icon = <CodeIcon />;

/**
 * Get a segment type definition by type name
 */
export function getSegmentTypeDefinition(type: string): SegmentTypeDefinition | undefined {
  return SEGMENT_TYPES.find(def => def.type === type);
}

/**
 * Get all segment type names
 */
export function getSegmentTypeNames(): string[] {
  return SEGMENT_TYPES.map(def => def.type);
}

/**
 * Get the display name for a segment type
 */
export function getSegmentDisplayName(type: string): string {
  return getSegmentTypeDefinition(type)?.name || type;
}

/**
 * Get the default properties for a segment type
 */
export function getSegmentDefaultProperties(type: string): Record<string, any> {
  return getSegmentTypeDefinition(type)?.defaultProperties || {};
}
