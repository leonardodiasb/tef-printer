import osUtils from 'os-utils';
import fs from 'fs';
import os from 'os';
import { BrowserWindow } from 'electron';

const POOLING_INTERVAL = 500;

export function poolResource(mainWindow: BrowserWindow) {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageUsage = getStorageData();
    mainWindow.webContents.send('statistics', {cpuUsage, ramUsage, storageUsage: storageUsage.usage })
  }, POOLING_INTERVAL);
}

export function getStaticData() {
  const totalStorage = getStorageData().total;
  const cpuModel = os.cpus()[0].model;
  const totalMemoryGb = Math.floor(osUtils.totalmem() / 1024);
  return {
    totalStorage,
    cpuModel,
    totalMemoryGb
  }
}

export function getCpuUsage() {
  return new Promise(resolve => {
    osUtils.cpuUsage(resolve)
  })
}

export function getRamUsage() {
  return 1 - osUtils.freememPercentage();
}

function getStorageData() {
  const stats = fs.statfsSync(process.platform === 'win32' ? 'C:' : '/');
  const total = stats.bsize * stats.blocks;
  const free = stats.bsize * stats.bfree;
  return {
    total: Math.floor(total / 1_000_000_000),
    usage: 1 - free / total
  }
}