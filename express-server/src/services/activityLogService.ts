import activityLogRepository, { ActivityLog } from "../repositories/activityLogRepository.js";

/**
 * Service Layer
 *
 * ActivityLogService coordinates access to activity logs.
 *
 * Business logic belongs here rather than in the
 * Controller or Repository.
 */
class ActivityLogService {

    /**
     * Retrieves all activity logs belonging to a user.
     */
    async getLogsByUserId(
        userId: number
    ): Promise<ActivityLog[]> {

        return activityLogRepository.getLogsByUserId(
            userId
        );
    }
}

export default new ActivityLogService();