export function startFakeJourney(
  onUpdate: (data: { status: string; eta: string }) => void
) {
  let etaMinutes = 30;
  let status = 'Moving';

  const interval = setInterval(() => {
    etaMinutes -= 1;

    if (etaMinutes <= 0) {
      status = 'Arrived';
      clearInterval(interval);
    }

    onUpdate({
      status,
      eta: etaMinutes > 0 ? `${etaMinutes} min` : 'Arrived',
    });
  }, 2000);

  return () => clearInterval(interval);
}
