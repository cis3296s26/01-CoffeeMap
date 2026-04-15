export default function StarRating({ rating = 0, onRate }) {
    return (
        <div style={{ display: 'inline-flex', gap: '2px', cursor: onRate ? 'pointer' : 'default' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    onClick={() => onRate && onRate(star)}
                    style={{
                        fontSize: '1.3rem',
                        color: star <= rating ? '#f5a623' : '#ccc',
                        userSelect: 'none',
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}