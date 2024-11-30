import React, { useState, useEffect } from 'react';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from '@mui/lab';
import { Typography, Box } from '@mui/material';
import { format } from 'date-fns';

export function ActivityHistory({ userId }) {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetchActivities();
  }, [userId]);

  const fetchActivities = async () => {
    try {
      const response = await fetch(`/api/activity/${userId}`);
      const data = await response.json();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>

      <Timeline>
        {activities.map((activity) => (
          <TimelineItem key={activity.id}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography variant="body2" color="textSecondary">
                {format(new Date(activity.createdAt), 'MMM dd, yyyy HH:mm')}
              </Typography>
              <Typography>{activity.type}</Typography>
              {activity.metadata && (
                <Typography variant="body2" color="textSecondary">
                  {activity.metadata.details}
                </Typography>
              )}
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
}