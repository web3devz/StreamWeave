import { createSession, updateSession, terminateSession } from '../src/methods/session';
import { Session, SessionStatus } from '../src/types/session';

describe('Session Management', () => {
    let session: Session;

    beforeEach(() => {
        session = createSession();
    });

    test('should create a session', () => {
        expect(session).toBeDefined();
        expect(session.status).toBe(SessionStatus.ACTIVE);
    });

    test('should update a session', () => {
        const updatedSession = updateSession(session.id, { status: SessionStatus.UPDATED });
        expect(updatedSession.status).toBe(SessionStatus.UPDATED);
    });

    test('should terminate a session', () => {
        const terminatedSession = terminateSession(session.id);
        expect(terminatedSession.status).toBe(SessionStatus.TERMINATED);
    });
});