import osUtils from 'os-utils';
import fs from 'fs';

const POOLING_INTERVAL = 500;

export function poolResource() {
  setInterval(async () => {
    const cpuUsage = await getCpuUsage();
    const ramUsage = getRamUsage();
    const storageUsage = getStorageData();
    console.log({cpuUsage, ramUsage, storageUsage: storageUsage.usage });
  }, POOLING_INTERVAL);
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