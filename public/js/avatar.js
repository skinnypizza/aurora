function avatarSVG(name, color, size) {
  const c = color || '#6366f1';
  const s = size || 40;
  const initial = (name || '?').charAt(0).toUpperCase();
  return 'data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + s + '" height="' + s + '" viewBox="0 0 ' + s + ' ' + s + '">' +
    '<rect width="' + s + '" height="' + s + '" rx="' + (s * 0.22) + '" fill="' + c + '22"/>' +
    '<text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="' + c + '" font-size="' + (s * 0.42) + '" font-weight="700" font-family="Geist,sans-serif">' + initial + '</text>' +
    '</svg>'
  );
}
